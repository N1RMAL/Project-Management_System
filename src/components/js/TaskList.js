import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TaskCard from "./TaskCard";
import "../css/TaskList.css";
import { getTasks, updateTask } from "../../services/api"; // Import API functions

const TaskList = ({ assignUser, users, selectedGroup }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    if (!selectedGroup || !selectedGroup.id) {
      console.error("Group not selected or invalid group.");
      setError("Please select a valid group.");
      setLoading(false);
      return;
    }

    setError(null);
    try {
      setLoading(true);
      const data = await getTasks({ group: selectedGroup.id });
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedGroup]);

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    setLoading(true);
    try {
      const updatedTask = await updateTask(taskId, updatedTaskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedGroup) {
    return <p className="error-message">Please select a group to view tasks.</p>;
  }

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => fetchTasks()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Tasks for {selectedGroup.name}</h2>
      {tasks.length === 0 ? (
        <p>No tasks available for this group. Create a task to get started!</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
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

TaskList.propTypes = {
  assignUser: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  selectedGroup: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default TaskList;
