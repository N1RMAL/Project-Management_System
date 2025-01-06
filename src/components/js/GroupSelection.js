import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/GroupSelection.css";

const GroupSelection = ({ onGroupSelect }) => {
  const navigate = useNavigate();

  const handleGroupClick = (group) => {
    onGroupSelect(group); // Call parent handler
    navigate("/"); // Redirect to the task page
  };

  return (
    <div className="group-selection">
      <h2>Select a Group</h2>
      <div className="group-options">
        <button onClick={() => handleGroupClick({ id: 1, name: "HR Services" })} className="group-button">
          HR Services
        </button>
        <button onClick={() => handleGroupClick({ id: 2, name: "Research and Development" })} className="group-button">
          Research and Development
        </button>
        <button onClick={() => handleGroupClick({ id: 3, name: "Accounting" })} className="group-button">
          Accounting
        </button>
      </div>
    </div>
  );
};

export default GroupSelection;
