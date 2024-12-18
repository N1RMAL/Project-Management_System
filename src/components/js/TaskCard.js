import React, { useState } from "react";
import Timer from "./Timer";
import "../css/TaskCard.css";

const TaskCard = ({ task, updateTask, assignUser, users }) => {
  const [schedule, setSchedule] = useState(task.schedule || "");
  const [useTimer, setUseTimer] = useState(task.useTimer);
  const [selectedUser, setSelectedUser] = useState("");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
  
    if (newStatus === "in-progress") {
      updateTask(task.id, { ...task, status: newStatus });
      return;
    }
  
    if (newStatus === "completed") {
      if (useTimer && task.time === 0) {
        alert("Please stop the timer before completing the task.");
        return;
      }
      if (!useTimer && !schedule) {
        alert("Please set a schedule before completing the task.");
        return;
      }
  
      updateTask(task.id, { ...task, status: newStatus, schedule, useTimer });
    }
  };
  

  const handleScheduleChange = (e) => {
    setSchedule(e.target.value);
    updateTask(task.id, { ...task, schedule: e.target.value });
  };

  const toggleTimerOrSchedule = () => {
    setUseTimer(!useTimer);
    updateTask(task.id, { ...task, useTimer: !useTimer });
  };

  const handleAssignUser = () => {
    if (selectedUser) {
      assignUser(task.id, selectedUser);
      setSelectedUser("");
    }
  };

  return (
    <div className="task-card">
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>
        <strong>Assigned To:</strong> {task.assignedTo.length > 0 ? task.assignedTo.join(", ") : "Not Assigned"}
      </p>
      <select value={task.status} onChange={handleStatusChange} className="status-select">
        <option value="todo">To-Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      {task.status === "in-progress" && (
        <>
          <div className="toggle-section">
            <button onClick={toggleTimerOrSchedule} className="btn-toggle">
              {useTimer ? "Switch to Schedule" : "Switch to Timer"}
            </button>
          </div>
          {useTimer ? (
            <Timer task={task} updateTask={updateTask} />
          ) : (
            <div className="schedule-section">
              <label>Schedule (HH:MM-HH:MM):</label>
              <input
                type="text"
                value={schedule}
                onChange={handleScheduleChange}
                placeholder="e.g., 08:00-13:00"
              />
            </div>
          )}
        </>
      )}
      <div className="assign-section">
        <label>Assign User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="assign-select"
        >
          <option value="">Select User</option>
          {users.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
        <button onClick={handleAssignUser} className="btn-assign">
          Assign
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
