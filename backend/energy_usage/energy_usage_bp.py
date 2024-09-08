import os
import uuid
from flask import Blueprint, jsonify, request, make_response
from datetime import datetime, timedelta
from config import get_db_session
from models import Sensor, EnergyUsage

# Create a Blueprint for energy usage routes
energy_usage_bp = Blueprint("energy_usage_bp", __name__)

# Route to record energy usage
@energy_usage_bp.route("/record-usage", methods=["POST"])
def record_energy_usage():
    """
    Record energy usage from a sensor.
    Expects sensor_name, usage_kwh, and user_id in the request body.
    """
    data = request.json
    sensor_name = data.get("sensor_name")
    usage_kwh = data.get("usage_kwh")
    user_id = data.get("user_id")

    session = get_db_session()
    try:
        # Fetch the sensor based on the sensor name
        sensor = session.query(Sensor).filter_by(sensor_name=sensor_name).first()

        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404

        # Store the energy usage in the EnergyUsage table
        new_usage_record = EnergyUsage(
            location=sensor.location,
            sensor_id=sensor_name,
            usage_kwh=usage_kwh,
            timestamp=datetime.utcnow(),
            user_id=uuid.UUID(user_id),
        )
        session.add(new_usage_record)
        session.commit()

        return make_response(
            jsonify({"message": "Energy usage recorded successfully."}), 201
        )
    except Exception as e:
        session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


# Route to fetch energy usage for a specific month
@energy_usage_bp.route("/usage/<int:year>/<int:month>", methods=["GET"])
def get_monthly_energy_usage(year, month):
    """
    Fetch energy usage for a specific month for a user.
    Expects user_id as a query parameter.
    """
    user_id = request.args.get("user_id")  # Assuming user ID is passed as query param
    session = get_db_session()

    try:
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=32)).replace(day=1)

        usage_records = (
            session.query(EnergyUsage)
            .filter(
                EnergyUsage.user_id == uuid.UUID(user_id),
                EnergyUsage.timestamp >= start_date,
                EnergyUsage.timestamp < end_date,
            )
            .all()
        )

        total_usage = sum(record.usage_kwh for record in usage_records)

        return (
            jsonify(
                {
                    "total_usage_kwh": total_usage,
                    "usage_records": [
                        {
                            "date": record.timestamp.strftime("%Y-%m-%d"),
                            "usage_kwh": record.usage_kwh,
                        }
                        for record in usage_records
                    ],
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


# Route to handle the energy bill calculation for a specific month
@energy_usage_bp.route("/pay-bill/<int:year>/<int:month>", methods=["POST"])
def pay_bill(year, month):
    """
    Calculate the total bill for a given month for a user.
    Expects user_id in the request body.
    """
    user_id = request.json.get("user_id")
    session = get_db_session()

    try:
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=32)).replace(day=1)

        # Fetch energy usage for the given month
        usage_records = (
            session.query(EnergyUsage)
            .filter(
                EnergyUsage.user_id == uuid.UUID(user_id),
                EnergyUsage.timestamp >= start_date,
                EnergyUsage.timestamp < end_date,
            )
            .all()
        )

        total_usage = sum(record.usage_kwh for record in usage_records)
        total_bill = total_usage * 100  # Assuming 1 dollar per unit, converted to INR

        # Return usage and bill details
        return (
            jsonify(
                {
                    "total_usage_kwh": total_usage,
                    "total_bill": total_bill,
                    "usage_records": [
                        {
                            "date": record.timestamp.strftime("%Y-%m-%d"),
                            "usage_kwh": record.usage_kwh,
                        }
                        for record in usage_records
                    ],
                }
            ),
            200,
        )

    except Exception as e:
        session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
