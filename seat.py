import math
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow specific frontend origin

# Initialize Firebase only once
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(r"D:\Projects\New folder\rittm-85aec-firebase-adminsdk-fbsvc-621639cbae.json")
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized.")
    except Exception as e:
        print("❌ Error initializing Firebase:", e)

db = firestore.client()

# Endpoint for Admin to Add New Bus
@app.route('/admin/add_bus', methods=['POST'])
def add_bus():
    try:
        data = request.get_json()

        # Required fields from the request
        bus_id = data.get('bus_id')
        bus_no = data.get('bus_no')
        route_no = data.get('route_no')
        pickup_points = data.get('pickup_points')
        rows = data.get('rows')
        cols = data.get('cols')

        # Validate input
        if not all([bus_id, bus_no, route_no, pickup_points, rows, cols]):
            return jsonify({"error": "Missing required fields"}), 400

        # Generate seat layout (rows x cols)
        seat_letters = [chr(ord('A') + i) for i in range(cols)]
        front_rows_count = max(2, round(rows * 0.4))  # 40% of the rows for the front section
        seats = []

        # Create the seat grid
        for r in range(1, rows + 1):
            section = 'Front' if r <= front_rows_count else 'Back'
            for c in range(cols):
                seats.append({
                    'seat_id': f"{r}{seat_letters[c]}",
                    'row': r,
                    'col_index': c + 1,
                    'seat_letter': seat_letters[c],
                    'section': section,
                    'is_occupied': False,
                    'assigned_user_id': None,
                    'assigned_gender': None,
                    'assigned_type': None
                })

        # Save bus layout to Firestore
        bus_data = {
            'details': {
                'bus_no': bus_no,
                'route_no': route_no,
                'pickup_points': [{'name': pt} for pt in pickup_points]
            },
            'seats': seats
        }

        db.collection('bus_layouts').document(bus_id).set(bus_data)

        return jsonify({"message": f"Bus '{bus_id}' added successfully."}), 200

    except Exception as e:
        print("❌ Error adding bus:", e)
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)