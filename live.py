import os
import math
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import firebase_admin
from firebase_admin import credentials, firestore
import eventlet

eventlet.monkey_patch()  # Required for async server support

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow all origins (safe for development)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow frontend socket connection

# Initialize Firebase
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(r"D:\Projects\fb\rittransitmate-firebase-adminsdk-fbsvc-13f2617338.json")
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized.")
except Exception as e:
    print("❌ Firebase initialization error:", e)

db = firestore.client()

# Endpoint to receive live location data and emit to frontend
@app.route("/send_location", methods=["POST"])
def send_location():
    try:
        data = request.get_json()
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is None or longitude is None:
            return jsonify({"error": "Latitude and longitude are required."}), 400

        # Emit to all connected clients
        socketio.emit("receiveLocation", {"latitude": latitude, "longitude": longitude}, broadcast=True)
        print(f"📡 Location broadcasted: {latitude}, {longitude}")

        return jsonify({"message": "Location update sent!"}), 200
    except Exception as e:
        print("❌ Error in /send_location:", e)
        return jsonify({"error": str(e)}), 500

# SocketIO test connect event (optional)
@socketio.on('connect')
def on_connect():
    print("🟢 Client connected via Socket.IO")
    emit('response', {'message': 'Connected to live location server'})

# Start the SocketIO server
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)

