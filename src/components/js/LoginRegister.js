import React, { useState } from "react";
import "../css/LoginRegister.css";

const LoginRegister = ({ onAuthenticate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onAuthenticate();
    }
  };

  return (
    <div className="login-register-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="login-register-form">
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
        <button type="submit" className="btn-primary">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button onClick={toggleForm} className="btn-secondary">
        {isLogin ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
};

export default LoginRegister;