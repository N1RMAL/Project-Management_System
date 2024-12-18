import React from "react";
import "../css/Header.css";

const Header = ({ onLogout, onGroupSelect }) => {
  const handleHomeClick = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <header className="header-container">
      <div className="header-left" onClick={handleHomeClick}>
        <h1>Home Page</h1>
      </div>
      <div className="header-center">
        <button onClick={() => onGroupSelect(null)} className="btn-groups">
          Groups
        </button>
      </div>
      <div className="header-right">
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;