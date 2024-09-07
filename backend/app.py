# all imports go here
import os
from flask_cors import CORS
from config import app, db
from flask import request, jsonify, g
from event_management.event_bp import event_bp
from fire_sensor.fire_sensor_bp import fire_sensor_bp
from user.user_bp import user_bp
from user_emergency.user_emergency_bp import user_emergency_bp
from garbage_sensor.garbage_sensor_bp import garbage_sensor_bp
from energy_usage.energy_usage_bp import energy_usage_bp

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

# garbage collection blueprint
app.register_blueprint(garbage_sensor_bp, url_prefix="/garbage-collection")

# energy usage blueprint
app.register_blueprint(energy_usage_bp, url_prefix="/energy-usage")

app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")


def error_response(message):
    return jsonify({"error": message}), 401


def handle_bearer_auth(auth_header, g):
    """
    Handles bearer authentication by extracting the user_id from the request header.

    Args:
        auth_header (str): The authorization header containing the user_id.
        g (object): The global object used to store data for the current request.

    Returns:
        object: The error response if any error occurs during authentication, otherwise None.
    """
    try:
        g.user_id = auth_header.split("Bearer")[1].strip()
        if not g.user_id:
            return error_response("Invalid user_id")
    except Exception:
        return error_response("Invalid authorization header")


@app.before_request
def before_request():
    if not request.endpoint:
        return

    auth_header = request.headers.get("Authorization")
    if auth_header and "Bearer" in auth_header:
        # User ID authentication is optional
        error = handle_bearer_auth(auth_header, g)
        if error:
            return error
    else:
        # No authentication provided, set default value
        g.user_id = None


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
