import React from "react";
import "../css/GroupSelection.css";

const GroupSelection = ({ onGroupSelect }) => {
  return (
    <div className="group-selection">
      <h2>Select a Group</h2>
      <div className="group-options">
        <button onClick={() => onGroupSelect("HR Group")} className="group-button">
          HR Group
        </button>
        <button onClick={() => onGroupSelect("Research and Development Group")} className="group-button">
          Research and Development Group
        </button>
        <button onClick={() => onGroupSelect("Accounting")} className="group-button">
          Accounting
        </button>
      </div>
    </div>
  );
};

export default GroupSelection;