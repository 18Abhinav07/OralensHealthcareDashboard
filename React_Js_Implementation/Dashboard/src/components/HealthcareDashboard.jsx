/**
 * @title Healthcare Dashboard
 * @dev React component for a healthcare dashboard form that allows users to submit patient data.
 *      Includes fields for name, age, and medical records (file upload).
 *      Implements form validation, file drag-and-drop functionality, and integration with a Flask backend.
 * @notice This component demonstrates a form handling use case with modern UI/UX and asynchronous data submission.
 */

import React, { useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const HealthcareDashboard = () => {
  /**
   * @notice State variables for form data, errors, and UI control.
   * @dev Uses React's useState for controlled inputs and validation handling.
   */
  const [formData, setFormData] = useState({
    name: "", // User's full name
    age: "", // User's age
    file: null, // Uploaded file object
  });

  const [errors, setErrors] = useState({}); // Stores validation error messages
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks if the form is being submitted
  const [submitMessage, setSubmitMessage] = useState(""); // Message displayed upon submission
  const [messageType, setMessageType] = useState(""); // Type of message ("error" or "success")
  const [isDragging, setIsDragging] = useState(false); // Tracks drag-and-drop status

  /**
   * @notice Validates form fields according to predefined rules.
   * @return {boolean} Returns true if all fields pass validation, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = "Name should only contain letters";
    }

    // Validate age
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 0 || formData.age > 150) {
      newErrors.age = "Age must be between 0 and 150";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * @notice Updates the form data when a user inputs values.
   * @param {Event} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * @notice Handles file drag-and-drop events.
   * @param {Event} e - The drag-over or drag-leave event.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * @notice Handles file drop event and validates the file.
   * @param {Event} e - The drop event.
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  /**
   * @notice Validates and sets the selected file in the form data.
   * @param {File} file - The uploaded file.
   */
  const handleFileSelection = (file) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF, JPEG, and PNG files are allowed",
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        file: "File size should be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file: file,
    }));
    setErrors((prev) => ({
      ...prev,
      file: "",
    }));
  };

  /**
   * @notice Handles file selection through the input element.
   * @param {Event} e - The file input change event.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  /**
   * @notice Submits the form data to the Flask backend.
   * @param {Event} e - The form submit event.
   * @dev Validates the form, sends data via an HTTP POST request, and handles the response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessageType("error");
      setSubmitMessage("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("age", formData.age);
    if (formData.file) {
      submitData.append("file", formData.file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/form",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      setMessageType("success");
      setSubmitMessage(response.data.message);

      setFormData({
        name: "",
        age: "",
        file: null,
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      let errorMessage =
        error.response?.data?.error || error.message || "Submission error";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response?.status === 413) {
        errorMessage = "File is too large. Maximum size is 5MB.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      }

      setMessageType("error");
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
      if (messageType === "success") {
        setTimeout(() => setSubmitMessage(""), 5000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 felx items-center justify-center">
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
            Healthcare Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter patient information
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 animate-shake">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Age Input */}
            <div className="relative">
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <div className="mt-1">
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {errors.age && (
                <p className="mt-1 text-sm text-red-600 animate-shake">
                  {errors.age}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="relative">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                Medical Records
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : errors.file
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 5MB
                  </p>
                  {formData.file && (
                    <p className="text-sm text-green-600">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
              </div>
              {errors.file && (
                <p className="mt-1 text-sm text-red-600 animate-shake">
                  {errors.file}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`flex items-center justify-center space-x-2 text-sm animate-fade-in ${
                  messageType === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {messageType === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <span>{submitMessage}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;
