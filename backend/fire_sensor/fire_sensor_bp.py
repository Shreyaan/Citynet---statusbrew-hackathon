from flask import Blueprint, jsonify, request, make_response
from config import get_db_session
from utils.emergency import store_emergency, trigger_emergency_response, store_emergency_fire_logs
from models import Sensor  # Assuming Sensor is defined in models.py

# Create a Blueprint for fire sensor routes
fire_sensor_bp = Blueprint('fire_sensor_bp', __name__)


# Route to receive fire alert from sensors
@fire_sensor_bp.route('/fire-detected', methods=['POST'])
def receive_fire_alert():
    """
    Endpoint to receive fire detection alerts from sensors.
    It expects JSON data with the following fields:
    - sensor_name: Name of the sensor reporting the fire.
    - fire_hazard_level: Severity of the fire hazard (1: low, 2: medium, 3: high).
    - smoke_level: Smoke detection level, above 400 indicates potential fire.
    - temp_level: Temperature detection level, above 1850 indicates high heat/fire.
    """

    # Get the JSON data from the request
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract data from the request
    sensor_name = data.get('sensor_name')
    fire_hazard_level = data.get('fire_hazard_level')  # 1: low, 2: medium, 3: high severity
    smoke_level = data.get('smoke_level')  # Smoke level, above 400 indicates fire risk
    temp_level = data.get('temp_level')  # Temperature level, above 1850 indicates high heat

    # Check if required data is provided
    if not all([sensor_name, fire_hazard_level, smoke_level, temp_level]):
        return jsonify({"error": "Missing required fields"}), 400

    # Log the fire alert details for debugging purposes
    print(
        f"Fire detected by {sensor_name}: Hazard Level {fire_hazard_level}, Smoke Level {smoke_level}, Temp Level {temp_level}")

    # Get a new database session
    session = get_db_session()
    try:
        # Fetch the sensor's details from the database using the sensor name
        sensor = session.query(Sensor).filter_by(sensor_name=sensor_name).first()

        # If the sensor is not found, return a 404 error
        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404

        # Get the location of the sensor from the Sensor model
        sensor_location = sensor.location

        # Store the emergency details in the EmergencyReport table
        store_emergency(session, sensor_location, 'fire', sensor_id=sensor.sensor_name)

        # Store additional fire logs (hazard, smoke, and temperature levels)
        store_emergency_fire_logs(session, sensor.id, fire_hazard_level, smoke_level, temp_level)

        # Trigger the emergency response, such as sending SMS alerts
        trigger_emergency_response(sensor_location, 'fire', fire_hazard_level, smoke_level, temp_level)

        # Commit the changes to the database
        session.commit()

        # Return a success response to the client
        return make_response(jsonify({"message": "Fire alert received and emergency response triggered."}), 201)

    except Exception as e:
        # Rollback the session in case of an error
        session.rollback()
        # Log the error for debugging purposes
        print(f"Error occurred: {str(e)}")
        # Return a 500 Internal Server Error with the error message
        return jsonify({"error": str(e)}), 500

    finally:
        # Close the session to free up resources
        session.close()
