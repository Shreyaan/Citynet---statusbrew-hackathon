import uuid
from flask import Blueprint, jsonify, request, make_response, g
from config import get_db_session
from utils.emergency import store_emergency, trigger_emergency_response
from models import EmergencyReport

# Define the Blueprint for user emergency reports
user_emergency_bp = Blueprint("user_emergency_bp", __name__)


# Route to report an emergency
@user_emergency_bp.route("/report", methods=["POST"])
def report_emergency():
    """
    Endpoint to report an emergency. It stores the emergency in the database and triggers an emergency response.
    """
    try:
        # Retrieve user_id from g and validate it as a UUID
        user_id = uuid.UUID(g.user_id)
        data = request.json
        emergency_type = data.get("emergencyType")  # Extract the type of emergency
        location = data.get("location")  # Extract the location of the emergency

        session = get_db_session()
        try:
            # Store the emergency in the database
            store_emergency(session, location, emergency_type, user_id=user_id)
            session.commit()  # Commit the changes to the database

            # Trigger emergency response (e.g., send notifications)
            trigger_emergency_response(location, emergency_type)

            # Respond with success message
            return make_response(
                jsonify({"message": "Emergency reported and response triggered."}), 201
            )
        except Exception as e:
            print(e)
            session.rollback()  # Rollback the session in case of error
            return jsonify({"error": str(e)}), 500  # Return a 500 error on failure
        finally:
            session.close()  # Close the session to free resources
    except ValueError:
        # Handle invalid UUID format
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400


# Route to get the user's emergency report history
@user_emergency_bp.route("/history", methods=["GET"])
def get_emergency_history():
    """
    Endpoint to get the emergency report history for the current user.
    """
    try:
        # Retrieve and validate the user ID
        user_id = uuid.UUID(g.user_id)
        session = get_db_session()
        try:
            # Query the database for emergency reports for the current user
            emergency_reports = (
                session.query(EmergencyReport).filter_by(user_id=user_id).all()
            )

            # Format the report data
            reports = [
                {
                    "id": report.id,
                    "emergency_type": report.emergency_type,
                    "location": report.location,
                    "timestamp": report.timestamp.isoformat(),
                }
                for report in emergency_reports
            ]

            # Return the list of reports
            return jsonify(reports), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500  # Handle any errors with a 500 response
        finally:
            session.close()  # Close the session to free resources
    except ValueError:
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400


# Route to get the available emergency types
@user_emergency_bp.route("/types", methods=["GET"])
def get_emergency_types():
    """
    Endpoint to get the list of available emergency types (e.g., fire, medical).
    """
    emergency_types = ["fire", "medical", "crime", "natural_disaster", "other"]
    return jsonify(emergency_types), 200


# Route to get a specific emergency report by ID
@user_emergency_bp.route("/report/<int:report_id>", methods=["GET"])
def get_emergency_report(report_id):
    """
    Endpoint to get the details of a specific emergency report by its ID.
    """
    try:
        # Retrieve and validate the user ID
        user_id = uuid.UUID(g.user_id)
        session = get_db_session()
        try:
            # Query the database for the specific emergency report
            report = (
                session.query(EmergencyReport)
                .filter_by(id=report_id, user_id=user_id)
                .first()
            )

            if report:
                # If the report exists and belongs to the current user, return the report details
                return (
                    jsonify(
                        {
                            "id": report.id,
                            "emergency_type": report.emergency_type,
                            "location": report.location,
                            "timestamp": report.timestamp.isoformat(),
                        }
                    ),
                    200,
                )
            else:
                # If the report does not exist or does not belong to the user, return a 404 error
                return jsonify({"error": "Report not found or unauthorized"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500  # Handle errors with a 500 response
        finally:
            session.close()  # Close the session to free resources
    except ValueError:
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400
