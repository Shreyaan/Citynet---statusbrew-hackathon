import uuid
from flask import Blueprint, jsonify, request, make_response
from config import get_db_session
from utils.garbage_fill_msg import trigger_garbage_response
from models import Sensor, Garbage
from datetime import datetime

# Create a Blueprint for garbage sensor routes
garbage_sensor_bp = Blueprint('garbage_sensor_bp', __name__)

@garbage_sensor_bp.route('/garbage-overflow', methods=['POST'])
def receive_garbage_alert():
    data = request.json
    sensor_name = data.get('sensor_name')  # Sensor name from the request
    user_id = data.get('user_id')  # User ID (could be the user responsible for managing the bin)

    # Log the garbage alert details
    print("Garbage overflow detected at sensor:", sensor_name)

    session = get_db_session()
    try:
        # Fetch the sensor based on the sensor_name
        sensor = session.query(Sensor).filter_by(sensor_name=sensor_name).first()

        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404

        sensor_location = sensor.location  # Get the location of the sensor

        # Store the garbage overflow data in the Garbage table
        new_garbage_record = Garbage(
            location=sensor_location,
            sensor_id=sensor_name,  # Use sensor_name as the sensor_id
            timestamp=datetime.utcnow(),  # Record the current time
        )
        session.add(new_garbage_record)

        # Commit the session to save the data
        session.commit()

        # Trigger an emergency response (e.g., notify authorities via SMS)
        trigger_garbage_response(sensor_location)

        return make_response(jsonify({"message": "Garbage overflow alert received and logged."}), 201)

    except Exception as e:
        session.rollback()  # Rollback if there's an error
        print(f"Error: {str(e)}")  # Print the error for debugging
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
