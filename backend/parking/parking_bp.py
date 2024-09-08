from flask import Flask, request, jsonify, Blueprint
from config import get_db_session
from models import ParkingLot  # Assuming ParkingLot is imported from the models
import datetime

# Create Flask blueprint
parking_bp = Blueprint('parking_bp', __name__)

# Route to update parking lot status from sensor data
@parking_bp.route('/update-status', methods=['POST'])
def update_parking_status():
    """
    This endpoint receives data from the sensor and updates the parking lot status.
    Expected input: JSON with 'sensor_id' and 'status' (True for empty, False for occupied)
    """
    data = request.json

    # Extract sensor data from the request
    sensor_id = data.get('sensor_id')
    status = data.get('status')  # True = empty, False = occupied

    if not sensor_id or status is None:
        return jsonify({"error": "Invalid data provided"}), 400

    session = get_db_session()

    try:
        # Find the parking lot with the given sensor ID
        parking_lot = session.query(ParkingLot).filter_by(sensor_id=sensor_id).first()

        if not parking_lot:
            return jsonify({"error": "Parking lot not found"}), 404

        # Update the parking lot status
        parking_lot.status = status
        parking_lot.last_updated = datetime.datetime.utcnow()

        # Commit the transaction
        session.commit()

        return jsonify({"message": "Parking lot status updated successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@parking_bp.route('/status', methods=['GET'])
def get_parking_lots_status():
    """
    Fetches the status of all parking lots.
    Returns the parking lot data, including location from the Sensor table and availability.
    """
    session = get_db_session()
    try:
        # Fetch all parking lots along with their related sensors
        parking_lots = session.query(ParkingLot).all()

        # Create a list of parking lot information, fetching the location from the related Sensor table
        lots_data = [
            {
                "sensor_id": lot.sensor_id,
                "location": lot.sensor.location,  # Fetch location from the related Sensor table
                "status": "Empty" if lot.status else "Occupied",
                "last_updated": lot.last_updated.isoformat(),
            }
            for lot in parking_lots  # Iterate over each ParkingLot object
        ]

        # Return the parking lot data as JSON
        return jsonify(lots_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

