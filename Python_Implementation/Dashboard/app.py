"""
@title Healthcare Dashboard
@dev This Python application creates a user interface for a healthcare form using Streamlit.
The form allows users to input their name, age, and upload a file (e.g., medical record). 
It sends the data to a backend API for processing.

@notice The application validates user inputs before submission and handles backend responses,
providing feedback to the user based on the API response.

@backend This application interacts with a Flask backend API endpoint located at `http://localhost:5000/api/form`.
"""

import streamlit as st
import requests

# Streamlit page configuration
st.set_page_config(
    page_title="Healthcare Dashboard",
    page_icon="🏥",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# Define the backend URL
BACKEND_URL = "http://localhost:5000/api/form"

def main():
    # @notice Main function to render the healthcare dashboard.
    # @dev This function initializes the form, validates user inputs, and handles form submission
    # by sending data to the backend API.



    
    # @notice Renders a form for user input.
    # @dev The form collects:
    # - Name: The user's full name.
    # - Age: The user's age.
    # - File Upload: A file to be uploaded (allowed formats: txt, pdf, png, jpg, jpeg).
    # @return The form data is submitted via a 'Submit' button.

    # Title of the application
    st.title("Healthcare Dashboard")

    # Display form inputs for user interaction
    st.markdown("#### Enter your details:")

    # Form for collecting user input
    with st.form("healthcare_form"):
     
        name = st.text_input("Name", placeholder="Enter your name")
        age = st.number_input("Age", min_value=1, step=1)
        uploaded_file = st.file_uploader(
            "Upload File",
            type=["txt", "pdf", "png", "jpg", "jpeg"]
        )
        submit_button = st.form_submit_button("Submit")

    # Form submission and validation logic
    if submit_button:
        # @notice Triggered when the form is submitted.
        # @dev This section validates user input, displays errors if invalid, and submits
        # valid data to the backend. It also handles backend responses.

        # Input validation
        if not name:
            st.error("Name is required.")
        elif not age:
            st.error("Age must be a positive number.")
        elif not uploaded_file:
            st.error("File upload is required.")
        else:
            # Display a loading spinner while processing the form
            with st.spinner("Submitting your form..."):
                try:
                    # Prepare the form data
                    files = {
                        "file": (uploaded_file.name, uploaded_file.getvalue())
                    }
                    data = {"name": name, "age": age}

                    # POST request to the backend
                    response = requests.post(BACKEND_URL, data=data, files=files)

                    # Handle backend responses
                    if response.status_code == 200:
                        st.success("Form submitted successfully!")
                    else:
                        error_message = response.json().get("error", "Unknown error")
                        st.error(f"Failed to submit the form: {error_message}")

                except Exception as e:
                    # Handle any errors during the request
                    st.error(f"An error occurred: {str(e)}")


# @notice Entry point for the Streamlit application.
# @dev This ensures the main function is executed when the script is run directly.

# Entry point of the application
if __name__ == "__main__":
 
    main()
