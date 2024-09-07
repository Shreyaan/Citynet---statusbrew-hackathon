from models import EmergencyReport, EmergencyFireLogs
from datetime import datetime
from utils.twillo import send_sms
from sqlalchemy.orm import Session
import os


def store_emergency(
    session: Session, location, emergency_type, user_id=None, sensor_id=None
):
    """
    Store emergency details in the session, location could be either sensor location
    or user-filled location based on the caller.
    """
    new_emergency = EmergencyReport(
        location=location,  # Could be sensor or user-provided location
        emergency_type=emergency_type,
        user_id=user_id,
        sensor_id=sensor_id,
        timestamp=datetime.utcnow(),
    )
    session.add(new_emergency)
    # Removed session.commit() from here to avoid committing multiple times


def store_emergency_fire_logs(
    session: Session, sensor_id, fire_hazard_level, smoke_level, temp_level
):
    """
    Store fire emergency logs in the session with sensor details.
    """
    new_fire_log = EmergencyFireLogs(
        sensor_id=sensor_id,
        fire_hazard_level=fire_hazard_level,
        smoke_level=smoke_level,
        temp_level=temp_level,
    )
    session.add(new_fire_log)
    # Removed session.commit() from here to avoid committing multiple times


def trigger_emergency_response(
    location: str,
    emergency_type: str,
    fire_hazard_level: str = None,
    smoke_level: str = None,
    temp_level: str = None,
):
    """
    Trigger emergency response by sending an SMS based on the emergency type.
    """
    emergency_contact_number = os.getenv("EMERGENCY_CONTACT_NUMBER")

    # Create the message text based on emergency type
    if emergency_type == "fire":
        message_text = (
            f"Emergency response triggered for {emergency_type} at {location}, "
            f"fire hazard level: {fire_hazard_level}, smoke level: {smoke_level}, "
            f"temperature: {temp_level}"
        )
    else:
        message_text = f"Triggering response for {emergency_type} at {location}"

    # Send the SMS with the generated message
    try:
        message_sid = send_sms(emergency_contact_number, message_text)
        print(f"SMS sent successfully, SID: {message_sid}")
    except Exception as e:
        print(f"Failed to send SMS: {str(e)}")
