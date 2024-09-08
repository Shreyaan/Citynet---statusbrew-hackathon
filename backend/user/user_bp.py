import uuid
from flask import Blueprint, jsonify, request, g
from config import get_db_session
from models import User

# Blueprint for user routes
user_bp = Blueprint("user_bp", __name__)


# Route to edit user information (tags and phone number)
@user_bp.route("/edit", methods=["PUT"])
def edit_user():
    """
    Allows the current user to update their profile information.
    The user can update tags (comma-separated) and phone number.
    """
    # Get the user ID from the context (assuming it's set earlier, like via a JWT or session middleware)
    user_id = g.user_id

    # Extract data from the request body
    tags_str = request.json.get("tags")
    phone_number = request.json.get("phone_number")
    name = request.json.get("name")

    # Convert the comma-separated string of tags into a list
    tags = [tag.strip() for tag in tags_str.split(",")] if tags_str else []

    session = get_db_session()  # Start a new session for the database interaction
    try:
        # Query the database for the user by user_id
        user = session.query(User).filter_by(user_id=uuid.UUID(user_id)).first()
        if not user:
            return (
                jsonify({"error": "User not found"}),
                404,
            )  # Return 404 if user is not found

        # Update the user's tags and phone number (only if provided)
        if tags:
            user.tags = tags
        if phone_number:
            user.phone_number = phone_number
        if name:
            user.name = name

        session.commit()  # Commit the changes to the database
        return jsonify({"message": "User information updated successfully"}), 200

    except Exception as e:
        session.rollback()  # Rollback the transaction if there is an error
        return (
            jsonify({"error": f"Failed to update user information: {str(e)}"}),
            500,
        )  # Return a 500 error

    finally:
        session.close()  # Close the session to free up resources


# Route to get the user's profile information
@user_bp.route("/profile", methods=["GET"])
def get_user_profile():
    """
    Returns the profile information of the current user.
    Includes email, name, tags, and phone number.
    """
    # Get the user ID from the context (assuming it's set earlier, like via a JWT or session middleware)
    user_id = g.user_id

    session = get_db_session()  # Start a new session for the database interaction
    try:
        # Query the database for the user by user_id
        user = session.query(User).filter_by(user_id=uuid.UUID(user_id)).first()
        if not user:
            return (
                jsonify({"error": "User not found"}),
                404,
            )  # Return 404 if user is not found

        # Return the user's profile information as a JSON response
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
        return (
            jsonify({"error": f"Failed to retrieve user profile: {str(e)}"}),
            500,
        )  # Return a 500 error

    finally:
        session.close()  # Close the session to free up resources
