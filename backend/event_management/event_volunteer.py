from flask import Blueprint, jsonify, request, g
from config import get_db_session
from models import User, VolunteerForms, Events, EventRspvs
from sqlalchemy.exc import SQLAlchemyError
import uuid

from utils.twillo import send_sms

volunteer_bp = Blueprint("volunteer_bp", __name__)

# New EventRspvs Blueprint
rsvp_bp = Blueprint("rsvp_bp", __name__)


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


@rsvp_bp.route("/<event_id>", methods=["POST"])
def rsvp_for_event(event_id):
    session = get_db_session()
    try:
        user_id = g.user_id
        data = request.json
        status = data.get(
            "status", "attending"
        )  # Default to attending if not specified

        # Check if EventRspvs already exists
        existing_rsvp = (
            session.query(EventRspvs)
            .filter_by(event_id=event_id, user_id=uuid.UUID(user_id))
            .first()
        )

        if existing_rsvp:
            existing_rsvp.status = status
            message = "EventRspvs updated successfully"
        else:
            new_rsvp = EventRspvs(
                event_id=event_id, user_id=uuid.UUID(user_id), status=status
            )
            session.add(new_rsvp)
            message = "EventRspvs submitted successfully"

        session.commit()
        return jsonify({"message": message}), 200
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@rsvp_bp.route("/<event_id>", methods=["GET"])
def get_event_rsvps(event_id):
    session = get_db_session()
    try:
        rsvps = session.query(EventRspvs).filter_by(event_id=event_id).all()
        rsvp_list = [
            {
                "id": rsvp.id,
                "user_id": str(rsvp.user_id),
                "status": rsvp.status,
            }
            for rsvp in rsvps
        ]
        return jsonify(rsvp_list), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@rsvp_bp.route("/my-rsvps", methods=["GET"])
def get_user_rsvps():
    session = get_db_session()
    try:
        user_id = g.user_id
        rsvps = session.query(EventRspvs).filter_by(user_id=uuid.UUID(user_id)).all()
        rsvp_list = [
            {
                "id": rsvp.id,
                "event_id": rsvp.event_id,
                "event_title": session.query(Events.title)
                .filter_by(id=rsvp.event_id)
                .scalar(),
                "status": rsvp.status,
            }
            for rsvp in rsvps
        ]
        return jsonify(rsvp_list), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
