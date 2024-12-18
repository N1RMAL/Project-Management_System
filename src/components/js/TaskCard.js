import React, { useState } from "react";
import Timer from "./Timer";
import "../css/TaskCard.css";

const TaskCard = ({ task, updateTask, assignUser, users }) => {
  const [startTime, setStartTime] = useState({ hours: "", minutes: "" });
  const [endTime, setEndTime] = useState({ hours: "", minutes: "" });
  const [useTimer, setUseTimer] = useState(task.useTimer);
  const [selectedUser, setSelectedUser] = useState("");
  const [scheduleSet, setScheduleSet] = useState(false);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    if (newStatus === "in-progress") {
      updateTask(task.id, { ...task, status: newStatus });
      return;
    }

    if (newStatus === "completed") {
      if (task.assignedTo.length === 0) {
        alert("Please assign a user before completing the task.");
        return;
      }
      if (useTimer && task.time === 0) {
        alert("Please stop the timer before completing the task.");
        return;
      }
      if (!useTimer && !scheduleSet) {
        alert("Please set a valid schedule before completing the task.");
        return;
      }

      const schedule = `${startTime.hours}:${startTime.minutes}-${endTime.hours}:${endTime.minutes}`;
      updateTask(task.id, { ...task, status: newStatus, schedule, useTimer });
    }
  };

  const handleTimeChange = (e, type, period) => {
    const value = e.target.value.replace(/\D/, ""); // Remove non-numeric characters
    if (type === "start") {
      setStartTime((prev) => ({ ...prev, [period]: value }));
    } else {
      setEndTime((prev) => ({ ...prev, [period]: value }));
    }
  };

  const submitSchedule = () => {
    if (!startTime.hours || !startTime.minutes || !endTime.hours || !endTime.minutes) {
      alert("Please complete both start and end times.");
      return;
    }
    setScheduleSet(true);
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
      <div className="task-header">
        <div className="task-info">
          <h3>{task.name}</h3>
          <p>{task.description}</p>
        </div>
        <div className="assigned-to">
          <strong>Assigned To:</strong> {task.assignedTo.length > 0 ? task.assignedTo.join(", ") : "Not Assigned"}
        </div>
      </div>
      <div className="task-actions">
        <div className="assign-user">
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
        <div className="task-status">
          <label>Status:</label>
          <select value={task.status} onChange={handleStatusChange} className="status-select">
            <option value="todo">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      {task.status === "in-progress" && (
        <div className="schedule-timer-section">
          <div className="toggle-section">
            <button onClick={toggleTimerOrSchedule} className="btn-toggle">
              {useTimer ? "Switch to Schedule" : "Switch to Timer"}
            </button>
          </div>
          {useTimer ? (
            <Timer task={task} updateTask={updateTask} />
          ) : scheduleSet ? (
            <div className="schedule-display">
              <p>
                <strong>Start Time:</strong> {startTime.hours}:{startTime.minutes}
              </p>
              <p>
                <strong>End Time:</strong> {endTime.hours}:{endTime.minutes}
              </p>
              <button
                onClick={() => setScheduleSet(false)}
                className="btn-change-schedule"
              >
                Change Schedule
              </button>
            </div>
          ) : (
            <div className="schedule-section">
              <label>Start Time:</label>
              <div className="time-input">
                <input
                  type="text"
                  value={startTime.hours}
                  onChange={(e) => handleTimeChange(e, "start", "hours")}
                  maxLength={2}
                  placeholder="HH"
                />
                :
                <input
                  type="text"
                  value={startTime.minutes}
                  onChange={(e) => handleTimeChange(e, "start", "minutes")}
                  maxLength={2}
                  placeholder="MM"
                />
              </div>
              <label>End Time:</label>
              <div className="time-input">
                <input
                  type="text"
                  value={endTime.hours}
                  onChange={(e) => handleTimeChange(e, "end", "hours")}
                  maxLength={2}
                  placeholder="HH"
                />
                :
                <input
                  type="text"
                  value={endTime.minutes}
                  onChange={(e) => handleTimeChange(e, "end", "minutes")}
                  maxLength={2}
                  placeholder="MM"
                />
              </div>
              <button onClick={submitSchedule} className="btn-schedule">
                Set Schedule
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
