import React, { useState } from "react";
import "../css/Login.css";
import { login } from "../../services/api"; // Ensure correct relative path

const Login = ({ onAuthenticate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading spinner or state
    setError(""); // Clear any existing error messages
  
    try {
      // Call the login API with the provided username and password
      const data = await login({ username, password });
  
      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access); // Save the access token
      localStorage.setItem("refresh_token", data.refresh); // Save the refresh token
  
      // Notify parent component of successful authentication
      onAuthenticate();
  
      // Optionally redirect the user to the dashboard or initial page
      alert("Login successful!");
    } catch (err) {
      // Log the error for debugging purposes
      console.error("Login error:", err.response || err.message);
  
      // Handle specific error cases
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password. Please check your credentials and try again.");
      } else if (err.response && err.response.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // End loading state
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
