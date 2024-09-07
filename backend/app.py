# all imports go here
import os
from flask_cors import CORS
from config import app, db
from flask import request, session, jsonify, g
from event_management.event_bp import event_bp
from fire_sensor.fire_sensor_bp import fire_sensor_bp
from user.user_bp import user_bp
from user_emergency.user_emergency_bp import user_emergency_bp
from flask_jwt_extended import (
    JWTManager,
    get_jwt,
    get_jwt_identity,
    verify_jwt_in_request,
)


# demo '/' endpoint
@app.route("/", methods=["GET"])
def index():
    return "Hello World!"


CORS(app, resources={r"/*": {"origins": "*"}})


# test api route
@app.route("/api/test", methods=["GET"])
def test_api():
    return (
        jsonify({"message": "This is a test API endpoint.", "status": "success"}),
        200,
    )


# fire sensor feature blueprint
app.register_blueprint(fire_sensor_bp, url_prefix="/fire-sensor")

# user emergency feature blueprint
app.register_blueprint(user_emergency_bp, url_prefix="/user-emergency")

# event management feature blueprint
app.register_blueprint(event_bp, url_prefix="/events")

# user tags blueprint
app.register_blueprint(user_bp, url_prefix="/user/dashboard")

app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")


jwt = JWTManager(app)


def error_response(message):
    return jsonify({"error": message}), 401


def handle_bearer_auth(auth_header, g):
    """
    Handles bearer authentication by verifying the JWT token in the request header.

    Args:
        auth_header (str): The authorization header containing the JWT token.
        g (object): The global object used to store data for the current request.

    Returns:
        object: The error response if any error occurs during authentication, otherwise None.

    """
    verify_jwt_in_request(optional=True)
    g.jwt = get_jwt()
    if not g.jwt:
        return error_response("Invalid JWT token")
    g.raw_jwt = auth_header.split("Bearer")[1]
    g.user_id = get_jwt_identity() if g.jwt else None


@app.before_request
def before_request():
    # set up allowed endpoints list
    allowed_endpoints = [
        "/",
        "/api/test",
        "/events/api/test_event",
        "/events/create",
        "/events/getall",
        "/user/dashboard/api/test_user",
        "/user/dashboard/getall",
        "/user/dashboard/create",
    ]

    if request.endpoint and request.endpoint.startswith("api"):
        allowed_endpoints.append(request.endpoint)

    if not request.endpoint:
        return

    if request.endpoint not in allowed_endpoints and request.method != "OPTIONS":
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return error_response("Missing Authorization header")

        if "Bearer" in auth_header:
            # used for JWT token authentication in Frontend
            return handle_bearer_auth(auth_header, g)

        return error_response("Unsupported authentication method")


# run the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)


@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, Exception):
        response = jsonify({"error": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 500
