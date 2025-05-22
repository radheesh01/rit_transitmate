import math
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
from google.cloud.firestore_v1.base_query import FieldFilter

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(r"D:\Projects\New folder\rittm-85aec-firebase-adminsdk-fbsvc-621639cbae.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Utility: Generate seat layout
def generate_seat_layout(rows, cols):
    seats = []
    seat_letters = [chr(ord('A') + i) for i in range(cols)]
    front_rows_count = max(2, math.ceil(rows * 0.4))

    for r in range(1, rows + 1):
        section = 'Front' if r <= front_rows_count else 'Back'
        for c in range(cols):
            seats.append({
                "seat_id": f"{r}{seat_letters[c]}",
                "row": r,
                "col_index": c + 1,
                "seat_letter": seat_letters[c],
                "section": section,
                "is_occupied": False,
                "assigned_user_id": None,
                "assigned_gender": None,
                "assigned_type": None
            })
    return seats

# Utility: Get deboarding index
def get_deboarding_index(user, route_stops):
    try:
        return route_stops.index(user.get('deboarding_point_name', ''))
    except ValueError:
        return len(route_stops)

# Utility: Check if row has only same gender (for constraint)
def check_row_gender_constraint(seats, target_row, target_gender):
    for seat in seats:
        if seat['row'] == target_row and seat['is_occupied']:
            if seat['assigned_gender'] is not None and seat['assigned_gender'] != target_gender:
                return False
    return True

# Core: Seat allocation logic
def allocate_seats_to_existing_layout(user, bus_data):
    seats = bus_data['layout']
    route_stops = [p['name'] for p in bus_data['details'].get('pickup_points', [])]

    user['deboarding_index'] = get_deboarding_index(user, route_stops)
    user['category'] = 'disabled' if user.get('is_disabled') else user.get('type', 'student')

    user_id = user.get('id')
    user_gender = user.get('gender')
    user_category = user['category']
    preferred_section = 'Front' if user_category in ['disabled', 'staff'] or user_gender == 'female' else 'Back'

    # Prioritize preferred section and rows
    search_order = sorted(seats, key=lambda s: (
        0 if s['section'] == preferred_section else 1,
        s['row'],
        s['col_index']
    ))

    for seat in search_order:
        if not seat['is_occupied'] and check_row_gender_constraint(seats, seat['row'], user_gender):
            seat['is_occupied'] = True
            seat['assigned_user_id'] = user_id
            seat['assigned_gender'] = user_gender
            seat['assigned_type'] = user_category
            return seat['seat_id']

    return None  # No available seat

# Test endpoint
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"value": "OK"}), 200

# Main allocation endpoint
@app.route('/allocate', methods=['POST'])
def allocate_seat():
    data = request.get_json()

    # Required fields
    user_id = data.get('user_id')
    name = data.get('name')
    gender = data.get('gender')
    boarding_point = data.get('boarding_point')
    deboarding_point = data.get('deboarding_point')
    route_no = data.get('route_no')
    is_disabled = data.get('is_disabled', False)
    user_type = data.get('type', 'student')

    if not all([user_id, name, gender, boarding_point, deboarding_point, route_no]):
        return jsonify({"error": "Missing required user fields"}), 400

    # Fetch bus layout with matching pickup point
    buses_ref = db.collection("bus_layouts")
    buses = buses_ref.stream()

    selected_bus_doc = None
    for bus in buses:
        bus_data = bus.to_dict()
        pickup_names = [p['name'] for p in bus_data.get('details', {}).get('pickup_points', [])]
        if boarding_point in pickup_names:
            selected_bus_doc = bus
            break

    if not selected_bus_doc:
        return jsonify({"error": f"No bus found for route '{route_no}' with pickup point '{boarding_point}'"}), 404

    bus_data = selected_bus_doc.to_dict()
    assigned_bus_id = selected_bus_doc.id
    seats = bus_data.get('seats', [])
    details = bus_data.get('details', {})
    pickup_points = details.get('pickup_points', [])

    # Build full bus data
    full_bus_data = {
        'layout': seats,
        'details': {
            'pickup_points': pickup_points,
            'bus_no': details.get('bus_no'),
            'route_no': details.get('route_no')
        }
    }

    # Create user object
    user = {
        'id': user_id,
        'name': name,
        'gender': gender,
        'boarding_point_name': boarding_point,
        'deboarding_point_name': deboarding_point,
        'is_disabled': is_disabled,
        'type': user_type
    }

    # Allocate a seat
    seat_id = allocate_seats_to_existing_layout(user, full_bus_data)

    if seat_id is None:
        return jsonify({"error": "No seats available for this user!"}), 400

    # Save allocation
    allocation_data = {
        "user_id": user_id,
        "name": name,
        "bus_id": assigned_bus_id,
        "seat_id": seat_id,
        "gender": gender,
        "boarding_point": boarding_point,
        "deboarding_point": deboarding_point,
        "assigned_category": 'disabled' if is_disabled else user_type
    }
    db.collection('bus_allocations').add(allocation_data)

    # Update seat layout in Firestore
    db.collection('bus_layouts').document(assigned_bus_id).set({
        'seats': full_bus_data['layout'],
        'details': details
    })

    return jsonify({
        "message": "Seat allocated successfully",
        "allocation": allocation_data
    }), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)