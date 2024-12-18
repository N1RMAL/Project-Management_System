import React, { useState } from "react";
import Timer from "./Timer";
import "../css/TaskCard.css";

const TaskCard = ({ task, updateTask, users }) => {
  const [status, setStatus] = useState(task.status);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateTask({ ...task, status: newStatus, assignedTo: task.assignedTo || [] });
  };
  

  const assignToUser = (user) => {
    if (!task.assignedTo) {
      task.assignedTo = []; // Initialize if undefined
    }
    if (!task.assignedTo.includes(user)) {
      updateTask({ ...task, assignedTo: [...task.assignedTo, user] });
    }
  };

  return (
    <div className="task-card">
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>
        Assigned To: {task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo.join(", ") : "Not Assigned"}
      </p>
      <div className="assign-user">
        <select onChange={(e) => assignToUser(e.target.value)}>
          <option value="">Assign to User</option>
          {users.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      <select className="status-select" value={status} onChange={handleStatusChange}>
        <option value="todo">To-Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      {status === "in-progress" && <Timer task={task} updateTask={updateTask} />}
    </div>
  );
};

export default TaskCard;
