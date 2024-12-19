import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import "../css/TaskList.css";
import { getTasks, updateTask } from "../../services/api"; // Import API functions

const TaskList = ({ assignUser, users, selectedGroup }) => {
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks({ group: selectedGroup.id }); // Pass group ID to API
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    if (selectedGroup) {
      fetchTasks();
    }
  }, [selectedGroup]);

  // Handle task updates
  const handleUpdateTask = async (taskId, updatedTaskData) => {
    try {
      const updatedTask = await updateTask(taskId, updatedTaskData); // Update task via API
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      ); // Update the state
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
    }
  };

  return (
    <div className="task-list">
      <h2>Tasks for {selectedGroup ? selectedGroup.name : "Group"}</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks available for this group. Create a task to get started!</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id} // Use task ID from the backend
            task={task}
            updateTask={handleUpdateTask}
            assignUser={assignUser}
            users={users}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
