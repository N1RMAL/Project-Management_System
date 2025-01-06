import React, { useState } from "react";
import "../css/TaskForm.css";

const TaskForm = ({ addTask, selectedGroup }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedGroup) {
      alert("No group selected. Please navigate to a group to create a task.");
      return;
    }

    // Add the task with the selected group
    addTask({ name, description, group: selectedGroup });
    setName("");
    setDescription("");
  };

  return (
    <div className="task-form-container">
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="btn-primary">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
