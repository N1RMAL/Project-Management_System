import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Header.css";

const Header = ({ onLogout, onGroupSelect }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">Task Manager</div>
      <nav className="nav-links">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/tasks");
          }}
        >
          Dashboard
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/groups");
          }}
        >
          Groups
        </a>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
