import React, { useState } from "react";
import "../css/TaskForm.css";

const TaskForm = ({ addTask, users, addUser }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newUser, setNewUser] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({ name, description });
    setName("");
    setDescription("");
  };

  const handleAddUser = () => {
    if (newUser.trim()) {
      addUser(newUser.trim());
      setNewUser("");
    }
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
        <button type="submit" className="btn-primary">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
