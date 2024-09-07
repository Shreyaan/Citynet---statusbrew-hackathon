from flask import Blueprint, jsonify, request, g
from config import get_db_session
from models import User, VolunteerForms, Events
from sqlalchemy.exc import SQLAlchemyError
import uuid

from utils.twillo import send_sms

volunteer_bp = Blueprint("volunteer_bp", __name__)


@volunteer_bp.route("/apply/<event_id>", methods=["POST"])
def apply_for_volunteer(event_id):
    session = get_db_session()
    try:
        user_id = g.user_id
        data = request.json

        new_application = VolunteerForms(
            event_id=event_id,
            user_id=uuid.UUID(user_id),
            email=data["email"],
            phone_number=data["phone_number"],
            address=data.get("address"),
            availability=data.get("availability"),
            skills=data.get("skills", []),
            status="pending",  # Set initial status to pending
        )

        session.add(new_application)
        session.commit()

        return jsonify({"message": "Volunteer application submitted successfully"}), 201
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@volunteer_bp.route("/applications/<event_id>", methods=["GET"])
def get_volunteer_applications(event_id):
    session = get_db_session()
    try:
        applications = session.query(VolunteerForms).filter_by(event_id=event_id).all()
        applications_list = [
            {
                "id": app.id,
                "email": app.email,
                "phone_number": app.phone_number,
                "status": app.status,
                "address": app.address,
                "availability": app.availability,
                "skills": app.skills,
                "user_id": str(app.user_id),
            }
            for app in applications
        ]
        return jsonify(applications_list), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@volunteer_bp.route("/application/<application_id>", methods=["PUT"])
def update_application_status(application_id):
    session = get_db_session()
    try:
        data = request.json
        new_status = data.get("status")

        if new_status not in ["pending", "approved", "rejected"]:
            return jsonify({"error": "Invalid status"}), 400

        application = session.query(VolunteerForms).get(application_id)
        if not application:
            return jsonify({"error": "Application not found"}), 404

        application.status = new_status
        session.commit()

        return jsonify({"message": "Application status updated successfully"}), 200
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@volunteer_bp.route("/my-applications", methods=["GET"])
def get_user_applications():
    session = get_db_session()
    try:
        user_id = g.user_id
        applications = (
            session.query(VolunteerForms).filter_by(user_id=uuid.UUID(user_id)).all()
        )
        applications_list = [
            {
                "id": app.id,
                "event_id": app.event_id,
                "event_title": session.query(Events.title)
                .filter_by(id=app.event_id)
                .scalar(),
                "status": app.status,
                "skills": app.skills,
                "availability": app.availability,
            }
            for app in applications
        ]
        return jsonify(applications_list), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


# New route to get all pending volunteer applications
@volunteer_bp.route("/admin/pending", methods=["GET"])
def get_pending_applications():
    session = get_db_session()
    try:
        pending_applications = (
            session.query(VolunteerForms).filter_by(status="pending").all()
        )
        applications_list = [
            {
                "id": app.id,
                "event_id": app.event_id,
                "user_id": str(app.user_id),
                "email": app.email,
                "phone_number": app.phone_number,
                "address": app.address,
                "availability": app.availability,
                "skills": app.skills,
                "status": app.status,
            }
            for app in pending_applications
        ]
        return jsonify(applications_list), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


# New route to approve a volunteer application
@volunteer_bp.route("/admin/approve/<application_id>", methods=["POST"])
def approve_application(application_id):
    session = get_db_session()
    try:
        application: VolunteerForms = session.query(VolunteerForms).get(application_id)
        if not application:
            return jsonify({"error": "Application not found"}), 404

        application.status = "approved"
        session.commit()

        user: User = session.query(User).get(application.user_id)
        if user.phone_number:
            send_sms(
                user.phone_number,
                f"You have been approved as a volunteer for {application.event_id}! Check it out on our website",
            )

        return jsonify({"message": "Application approved successfully"}), 200
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


# New route to reject a volunteer application
@volunteer_bp.route("/admin/reject/<application_id>", methods=["POST"])
def reject_application(application_id):
    session = get_db_session()
    try:
        application = session.query(VolunteerForms).get(application_id)
        if not application:
            return jsonify({"error": "Application not found"}), 404

        application.status = "rejected"
        session.commit()

        return jsonify({"message": "Application rejected successfully"}), 200
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
