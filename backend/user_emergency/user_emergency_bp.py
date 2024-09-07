import uuid
from flask import Blueprint, jsonify, request, make_response, g
from flask_jwt_extended import jwt_required

from config import get_db_session
from utils.emergency import store_emergency, trigger_emergency_response

# Define the Blueprint for user emergency reports
user_emergency_bp = Blueprint('user_emergency_bp', __name__)

# Route to handle emergency reports submitted by authenticated users
@jwt_required()
@user_emergency_bp.route('/report', methods=['POST'])  # Ensure JWT authentication is required for this route
def report_emergency():
    try:
        # Validate and convert user_id to UUID from JWT session
        user_id = uuid.UUID(g.user_id)  # Retrieve the current user ID from the session
        print(user_id)  # Debugging: print the user_id
    except ValueError:
        # Return an error if user_id is not a valid UUID
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400

    # Parse the request data
    data = request.json
    emergency_type = data.get('emergency_type')  # Type of emergency (e.g., fire, flood)
    location = data.get('location')  # User-provided location for the emergency

    session = get_db_session()
    try:
        # Save the emergency report in the database
        store_emergency(session, location, emergency_type, user_id)

        # Trigger the emergency response (e.g., send notification/SMS)
        trigger_emergency_response(location, emergency_type)

        # Commit the transaction to save the emergency report
        session.commit()

        # Return a success response
        return make_response(jsonify({"message": "Emergency reported and response triggered."}), 201)
    except Exception as e:
        # Rollback the transaction in case of an error
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the database session
        session.close()
