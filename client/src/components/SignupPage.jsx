import React, { useState, useCallback } from "react";
import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/Api";
import { registerSuccess } from "../features/authSlice";
import { useDispatch } from "react-redux";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = useCallback(() => {
    if (!formData.username.trim()) {
      return "Username is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      return "Invalid email address";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error/message when user starts typing
    setError(null);
    setMessage(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData; // Remove confirmPassword
      const { data } = await axios.post(
        `${API_BASE_URL}/user/register`,
        dataToSend
      );
      setMessage(data.message || "Registration successful!");
      dispatch(registerSuccess(data)); // Register in Redux

      if (data.token) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Show success message briefly before redirecting
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            placeholder="Choose a username"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Choose a password"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            placeholder="Confirm your password"
            disabled={loading}
            required
          />
        </div>

        {error && (
          <div className="message error" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="message success" role="status">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-busy={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <Link to="/login" className="auth-link">
          Already have an account? Sign in
        </Link>
      </form>
    </div>
  );
}
