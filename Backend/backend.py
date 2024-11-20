"""
@title Healthcare Form Backend
@dev This Flask application serves as the backend for processing healthcare form submissions.
It accepts user details (name, age) and a file upload, validates the inputs, and saves the uploaded file.

@notice Ensure that the upload directory (`./uploads`) exists, and the application is run in a secure environment.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/form', methods=['POST'])
def submit_form():
    """
    @notice API endpoint to handle form submissions.
    @dev This endpoint validates input data (name, age, and file), saves the uploaded file to the server,
    and returns a success or error response.
    @return JSON response indicating success or the type of error encountered.
    """
    try:
        # Extract form data
        name = request.form.get('name')
        age = request.form.get('age')
        file = request.files.get('file')

        # Input validation
        if not name or not age or not file:
            """
            @notice Validation to ensure all fields are provided.
            @dev Returns a 400 error if any field is missing.
            """
            return jsonify({"error": "All fields are required."}), 400

        # Save the uploaded file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Return success response
        return jsonify({"message": "Form submitted successfully!"}), 200
    except Exception as e:
        """
        @notice Catches any exceptions during the process.
        @dev Returns a 400 error with the exception message.
        """
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    """
    @notice Entry point for the Flask application.
    @dev Runs the Flask app in debug mode.
    """
    app.run(debug=True)
