import uuid
from flask import Blueprint, jsonify, request, make_response
from config import get_db_session
from utils.garbage_fill_msg import trigger_garbage_response
from models import Sensor, Garbage
from datetime import datetime

# Create a Blueprint for garbage sensor routes
garbage_sensor_bp = Blueprint('garbage_sensor_bp', __name__)

# Route to handle garbage overflow alert
@garbage_sensor_bp.route('/garbage-overflow', methods=['POST'])
def receive_garbage_alert():
    """
    This route handles the garbage overflow alerts sent from the sensor.
    Expects sensor_name and user_id in the request body.
    Logs the overflow and triggers a response (e.g., sends notification).
    """
    data = request.json  # Get the JSON data from the request
    if not data:
        return jsonify({"error": "No data provided"}), 400  # Return 400 if no data is provided

    # Extract sensor_name and user_id from the JSON data
    sensor_name = data.get('sensor_name')  # Sensor name from the request
    user_id = data.get('user_id')  # User ID (could be the user responsible for managing the bin)

    # Log the garbage alert for debugging purposes
    print(f"Garbage overflow detected at sensor: {sensor_name}")

    session = get_db_session()  # Start a new database session
    try:
        # Fetch the sensor based on the sensor_name
        sensor = session.query(Sensor).filter_by(sensor_name=sensor_name).first()

        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404  # Return 404 if the sensor doesn't exist

        sensor_location = sensor.location  # Get the location of the sensor

        # Store the garbage overflow data in the Garbage table
        new_garbage_record = Garbage(
            location=sensor_location,
            sensor_id=sensor_name,  # Use sensor_name as the sensor_id
            timestamp=datetime.utcnow(),  # Record the current time
            user_id=uuid.UUID(user_id) if user_id else None,  # Handle user_id as UUID, if provided
        )
        session.add(new_garbage_record)  # Add the new record to the session

        # Commit the session to save the data
        session.commit()

        # Trigger an emergency response (e.g., notify authorities via SMS or email)
        trigger_garbage_response(sensor_location)

        # Return a success message with status 201 (Created)
        return make_response(jsonify({"message": "Garbage overflow alert received and logged."}), 201)

    except Exception as e:
        # Rollback the session in case of any error
        session.rollback()
        print(f"Error: {str(e)}")  # Log the error for debugging
        return jsonify({"error": "Failed to log garbage overflow alert."}), 500  # Return 500 Internal Server Error
    finally:
        # Close the session to release database resources
        session.close()
