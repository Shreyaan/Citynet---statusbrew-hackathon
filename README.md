# C.I.T.Y N.E.T

## Cracked Nerds
- **Team Members**: 
   - Ashwath Soni (ashboi005)
   - Shreyaan Seth (shreyaan)
   - Sahil Chabra (sahilchabra09)
   - Arunya Mahajan (Arunya-Kate)

## Project Summary

C.I.T.Y N.E.T is an AI-powered solution for urban management and community engagement. It provides features for event management, emergency reporting, volunteer coordination, and smart city services like garbage collection notifications and electricity bill alerts. The system integrates IoT sensors to collect real-time data for efficient city management.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Python, Flask
- **Database**: PostgreSQL (via SQLAlchemy)
- **Authentication**: Supabase
- **Styling**: Tailwind CSS
- **Other Technologies**: IoT sensors for data collection

## Key Features

- Event management and volunteer coordination
- Emergency reporting system
- Garbage collection notifications
- Smart electricity bill alerts
- IoT sensor integration for real-time data collection

## How to Run the App

### Frontend

1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the `backend` directory.
2. Create a virtual environment and activate it:
   ```
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up environment variables by creating a `.env` file based on the provided configuration.
5. Start the Flask server:
   ```
   python app.py
   ```

## How to Use the App

- Users can create an account or log in via the navbar.
- The main dashboard provides access to various features:
  - Create and manage events
  - Report emergencies
  - Apply for volunteer positions
  - View and edit user profile
- Administrators have additional capabilities for managing events and volunteer applications.

## Project Structure

- Frontend: Next.js application with TypeScript
- Backend: Flask application with SQLAlchemy ORM
- IoT Integration: Sensors send data to the backend for processing

## API Endpoints

- `/events`: Event management
- `/user-emergency`: Emergency reporting
- `/volunteer`: Volunteer management
- `/garbage-collection`: Garbage sensor data
- `/energy-usage`: Electricity usage data

## Additional Notes

- Ensure all environment variables are properly set in both frontend and backend.
- The project uses Supabase for authentication, so make sure to configure Supabase credentials.
- The backend requires a PostgreSQL database. Ensure the database is set up and the connection string is correctly specified in the `.env` file.
- IoT sensors should be configured to send data to the appropriate endpoints in the backend.
