#all imports go here
from config import app, db
from flask import request, session, jsonify, g
from itsdangerous import Signer, BadSignature
from event_management.event_bp import event_bp

#test api route
@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({
        "message": "This is a test API endpoint.",
        "status": "success"
    }), 200

#event feature blueprint
app.register_blueprint(event_bp, url_prefix='/events')

#run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)