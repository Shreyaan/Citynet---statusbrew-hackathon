import os
import uuid
import razorpay
from flask import Blueprint, jsonify, request, make_response
from datetime import datetime, timedelta
from config import get_db_session
from models import Sensor, EnergyUsage

RAZORPAY_KEY = os.getenv("RAZORPAY_KEY")
RAZORPAY_SECRET = os.getenv("RAZORPAY_SECRET")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY, RAZORPAY_SECRET))

# Create a Blueprint for energy usage routes
energy_usage_bp = Blueprint('energy_usage_bp', __name__)

# Route to record energy usage
@energy_usage_bp.route('/record-usage', methods=['POST'])
def record_energy_usage():
    data = request.json
    sensor_name = data.get('sensor_name')
    usage_kwh = data.get('usage_kwh')
    user_id = data.get('user_id')

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
            user_id=uuid.UUID(user_id)
        )
        session.add(new_usage_record)
        session.commit()

        return make_response(jsonify({"message": "Energy usage recorded successfully."}), 201)
    except Exception as e:
        session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Route to fetch energy usage for a specific month
@energy_usage_bp.route('/usage/<int:year>/<int:month>', methods=['GET'])
def get_monthly_energy_usage(year, month):
    user_id = request.args.get('user_id')  # Assuming user ID is passed as query param
    session = get_db_session()

    try:
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=32)).replace(day=1)

        usage_records = session.query(EnergyUsage).filter(
            EnergyUsage.user_id == uuid.UUID(user_id),
            EnergyUsage.timestamp >= start_date,
            EnergyUsage.timestamp < end_date
        ).all()

        total_usage = sum(record.usage_kwh for record in usage_records)
        total_bill = total_usage * 100  # Assuming 1 dollar per unit, multiplied by 100 for INR (paise)

        return jsonify({
            "total_usage_kwh": total_usage,
            "total_bill": total_bill,
            "usage_records": [
                {"date": record.timestamp.strftime("%Y-%m-%d"), "usage_kwh": record.usage_kwh}
                for record in usage_records
            ]
        }), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Route to handle Razorpay payment for energy bill
@energy_usage_bp.route('/pay-bill/<int:year>/<int:month>', methods=['POST'])
def pay_bill(year, month):
    user_id = request.json.get('user_id')
    session = get_db_session()

    try:
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=32)).replace(day=1)

        # Fetch energy usage for the given month
        usage_records = session.query(EnergyUsage).filter(
            EnergyUsage.user_id == uuid.UUID(user_id),
            EnergyUsage.timestamp >= start_date,
            EnergyUsage.timestamp < end_date
        ).all()

        total_usage = sum(record.usage_kwh for record in usage_records)
        total_bill = total_usage * 100  # Assuming 1 dollar per unit, converted to INR

        # Create Razorpay order
        payment = razorpay_client.order.create({
            'amount': int(total_bill * 100),  # Convert to paise (1 INR = 100 paise)
            'currency': 'INR',
            'payment_capture': '1'  # Auto capture after successful payment
        })

        # Return payment details as JSON for React frontend
        return jsonify({
            'order_id': payment['id'],
            'amount': payment['amount'],
            'currency': payment['currency'],
            'razorpay_key': RAZORPAY_KEY,
            'total_bill': total_bill
        }), 200

    except Exception as e:
        session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
