import React from "react";
import "../css/CompletedTasks.css";

const CompletedTasks = ({ completedTasks }) => {
  return (
    <div className="completed-tasks">
      <h2 className="completed-tasks-title">Completed Tasks</h2>
      {completedTasks.length === 0 ? (
        <p className="completed-tasks-empty">No tasks have been completed yet.</p>
      ) : (
        <ul className="completed-tasks-list">
          {completedTasks.map((task, index) => (
            <li key={index} className="completed-task-item">
              <div className="task-header">
                <h3 className="task-name">{task.name}</h3>
                <span className="task-time">⏱ {task.time}s</span>
              </div>
              <p className="task-description">{task.description}</p>
              <p className="task-assigned-to">
                <strong>Assigned To:</strong> {task.assignedTo.length > 0 ? task.assignedTo.join(", ") : "Not Assigned"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;