import React from "react";
import "../css/Header.css";

const Header = ({ onLogout, onGroupSelect }) => {
  return (
    <header className="header">
      <div className="logo">Task Manager</div>
      <nav className="nav-links">
        <a href="#" onClick={() => onGroupSelect(null)}>
          Dashboard
        </a>
        <a href="#" onClick={() => onGroupSelect("groups")}>
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
