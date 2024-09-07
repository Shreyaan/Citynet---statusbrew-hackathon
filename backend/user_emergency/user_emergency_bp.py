import uuid
from flask import Blueprint, jsonify, request, make_response, g
from flask_jwt_extended import jwt_required
from config import get_db_session
from utils.emergency import store_emergency, trigger_emergency_response
from models import EmergencyReport

# Define the Blueprint for user emergency reports
user_emergency_bp = Blueprint("user_emergency_bp", __name__)


@user_emergency_bp.route("/report", methods=["POST"])
def report_emergency():
    try:
        user_id = uuid.UUID(g.user_id)
        data = request.json
        emergency_type = data.get("emergencyType")
        location = data.get("location")

        session = get_db_session()
        try:
            store_emergency(session, location, emergency_type, user_id=user_id)
            session.commit()
            trigger_emergency_response(location, emergency_type)
            return make_response(
                jsonify({"message": "Emergency reported and response triggered."}), 201
            )
        except Exception as e:
            print(e)
            session.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            session.close()
    except ValueError:
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400


@user_emergency_bp.route("/history", methods=["GET"])
def get_emergency_history():
    try:
        user_id = uuid.UUID(g.user_id)
        session = get_db_session()
        try:
            emergency_reports = (
                session.query(EmergencyReport).filter_by(user_id=user_id).all()
            )
            reports = [
                {
                    "id": report.id,
                    "emergency_type": report.emergency_type,
                    "location": report.location,
                    "timestamp": report.timestamp.isoformat(),
                }
                for report in emergency_reports
            ]
            return jsonify(reports), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            session.close()
    except ValueError:
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400


@user_emergency_bp.route("/types", methods=["GET"])
def get_emergency_types():
    emergency_types = ["fire", "medical", "crime", "natural_disaster", "other"]
    return jsonify(emergency_types), 200


@user_emergency_bp.route("/report/<int:report_id>", methods=["GET"])
def get_emergency_report(report_id):
    try:
        user_id = uuid.UUID(g.user_id)
        session = get_db_session()
        try:
            report = (
                session.query(EmergencyReport)
                .filter_by(id=report_id, user_id=user_id)
                .first()
            )
            if report:
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
                return jsonify({"error": "Report not found or unauthorized"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            session.close()
    except ValueError:
        return jsonify({"error": "Invalid user_id format. Must be a valid UUID."}), 400
