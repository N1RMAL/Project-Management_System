import React, { useState } from "react";
import "../css/Login.css";
import { login } from "../../services/api"; // Ensure correct relative path

const Login = ({ onAuthenticate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      // Call the login API
      const data = await login({ username, password });
      localStorage.setItem("access_token", data.access); // Save the access token
      localStorage.setItem("refresh_token", data.refresh); // Save the refresh token
      onAuthenticate(); // Notify parent component of successful login
    } catch (err) {
      console.error("Error during login:", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false); // Stop loading
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
