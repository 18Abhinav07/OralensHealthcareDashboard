
# Healthcare Dashboard

A **Healthcare Dashboard** built using React (frontend) and Streamlit (frontend alternative) with a Flask backend, designed to manage patient information including name, age, and uploaded medical records. This project demonstrates file uploads, form validation, and efficient communication between the frontend and backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Error Handling](#error-handling)

---

## Overview

The **Healthcare Dashboard** is a web application with a user-friendly interface for managing patient data. Users can:

- Enter their name and age.
- Upload files like PDFs, JPEGs, or PNGs (up to 5MB).
- Submit the information to a Flask backend for processing.

The app offers:

- A React-based modern frontend.
- An alternative lightweight Streamlit implementation for Python users.
- Validation and error handling for better user experience.

---

## Features

1. **React Frontend**:
   - Fully interactive and responsive user interface.
   - Drag-and-drop file upload.
   - Real-time form validation with error messages.

2. **Streamlit Frontend**:
   - Lightweight Python-based interface for quick deployment and testing.
   - Integrated with the same Flask backend for API calls.

3. **Flask Backend**:
   - Processes form submissions.
   - Validates data and file uploads.
   - Returns success or error messages to the client.

4. **File Validation**:
   - Accepts only `.pdf`, `.jpg`, `.jpeg`, and `.png` files.
   - Ensures file size does not exceed 5MB.

---

## Requirements

**May require an environment creation for the python implementation and the test backend.**

### Backend Requirements

- Python 3.8 or higher
- Flask
- flask_cors
- Required Python packages (listed in `Backend/requirements.txt`)

### React Frontend Requirements

- Node.js (v16+)
- npm or yarn
- axios
- lucide-react

### Streamlit Frontend Requirements

- Python 3.8 or higher
- Streamlit
- Required Python packages (listed in `frontend-streamlit/requirements.txt`)

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/18Abhinav07/OralensHealthcareDashboard.git
cd healthcare-dashboard
```

### 2. Setting up the Backend

Navigate to the `Backend` folder:

```bash
cd Backend
pip install -r requirements.txt
```

Start the Flask server:

```bash
python backend.py
```

The server will run on `http://localhost:5000`.

### 3. Setting up the React Frontend

Navigate to the `React_Js_Implementation` folder:

```bash
cd ../React_Js_Implementation
npm install
npm run dev
```

The React app will run on `http://localhost:5173`.

### 4. Setting up the Streamlit Frontend

Navigate to the `Python_Implementation` folder:

```bash
cd ../Python_Implementation
pip install -r requirements.txt
```

Run the Streamlit app:

```bash
cd Dashboard
streamlit run app.py
```

The Streamlit app will run on `http://localhost:8501`.

---

## Usage

### React Frontend

1. Open the React app in your browser at `http://localhost:5173`.
2. Fill in the form with patient details and upload a valid file.
3. Click **Submit** to send the data to the backend.
4. Observe success or error messages based on the backend response.

### Streamlit Frontend

1. Open the Streamlit app in your browser at `http://localhost:8501`.
2. Enter the required details in the form.
3. Upload a valid file and click **Submit**.
4. Observe success or error messages from the backend.

---

## API Endpoints

### **POST /api/form**

- **Description**: Handles form submissions and validates input.
- **Request Body**:
  - `name` (string): Patient's full name.
  - `age` (integer): Patient's age.
  - `file` (file): Medical record (PDF, JPEG, or PNG).
- **Response**:
  - `200 OK`: Form submission successful.
  - `400 Bad Request`: Validation errors or incorrect input.

---

## Error Handling

1. **Frontend Validation**:
   - React app checks for empty fields, invalid file types, and file size.
   - Displays error messages dynamically.

2. **Backend Validation**:
   - Ensures all required fields are present.
   - Validates file type and size.
   - Returns detailed error messages for the client.

3. **Timeouts and Network Errors**:
   - React app displays a timeout message if the server does not respond.
   - Handles network errors gracefully.
