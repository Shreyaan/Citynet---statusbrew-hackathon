import os
from utils.twillo import send_sms
def trigger_garbage_response(location):
    """
    Trigger an SMS alert to the authorities when the garbage bin overflows.
    """
    emergency_contact_number = os.getenv("EMERGENCY_CONTACT_NUMBER")  # Authorities' phone number

    # Create the message text
    message_text = f"Garbage overflow detected at {location}. Kindly come to the given location and collect the garbage."

    # Send the SMS using Twilio
    try:
        message_sid = send_sms(emergency_contact_number, message_text)
        print(f"SMS sent successfully, SID: {message_sid}")
    except Exception as e:
        print(f"Failed to send SMS: {str(e)}")