import uuid
from flask import Blueprint, jsonify, request, g
from flask_jwt_extended import jwt_required
from config import get_db_session
from models import User

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/edit", methods=["PUT"])
def edit_user():
    user_id = g.user_id
    tags_str = request.json.get("tags")
    phone_number = request.json.get("phone_number")

    tags = [tag.strip() for tag in tags_str.split(",")] if tags_str else []

    session = get_db_session()
    try:
        user = session.query(User).filter_by(user_id=uuid.UUID(user_id)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if tags:
            user.tags = tags
        if phone_number:
            user.phone_number = phone_number

        session.commit()
        return jsonify({"message": "User information updated successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@user_bp.route("/profile", methods=["GET"])
def get_user_profile():
    user_id = g.user_id
    session = get_db_session()
    try:
        user = session.query(User).filter_by(user_id=uuid.UUID(user_id)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        return (
            jsonify(
                {
                    "email": user.email,
                    "name": user.name,
                    "tags": user.tags,
                    "phone_number": user.phone_number,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
