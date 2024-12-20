import React from "react";
import "../css/GroupSelection.css";

const GroupSelection = ({ onGroupSelect }) => {
  return (
    <div className="group-selection">
      <h2>Select a Group</h2>
      <div className="group-options">
        <button onClick={() => onGroupSelect({ id: 2, name: "HR Services" })} className="group-button">
          HR Services
        </button>
        <button onClick={() => onGroupSelect({ id: 1, name: "Research and Development" })} className="group-button">
          Research and Development
        </button>
        <button onClick={() => onGroupSelect({ id: 3, name: "Accounting" })} className="group-button">
          Accounting
        </button>
      </div>
    </div>
  );
};

export default GroupSelection;
