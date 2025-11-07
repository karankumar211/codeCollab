import React, { useState, useCallback } from "react";
import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/Api";
import { loginSuccess } from "../features/authSlice";
import { useDispatch } from "react-redux";
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateForm = useCallback(() => {
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      return "Invalid email address";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
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
      const { data } = await axios.post(`${API_BASE_URL}/user/login`, formData);
      setMessage(data.message || "Login successful!");
      dispatch(loginSuccess(data));// sending data to auth slice 
      
      if (data.token) {
        setFormData({ email: "", password: "" });
        // Show success message briefly before redirecting
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Enter your password"
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <Link to="/signup" className="auth-link">
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
}
