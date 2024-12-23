import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskForm from "./components/js/TaskForm";
import TaskList from "./components/js/TaskList";
import CompletedTasks from "./components/js/CompletedTasks";
import Login from "./components/js/Login";
import Header from "./components/js/Header";
import GroupSelection from "./components/js/GroupSelection";
import "./App.css";
import API from "./services/api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedGroup(null);
    localStorage.removeItem("access_token");
  };

  const handleGroupSelect = async (group) => {
    if (group) {
      console.log("Group selected:", group); // Debugging log
      setSelectedGroup(group);
      setTasks([]);
      setCompletedTasks([]);
  
      try {
        // Fetch tasks for the selected group
        const response = await API.get(`tasks/?group=${group.id}`);
        console.log("Fetched tasks for group:", response); // Debugging log
        setTasks(response); // Update tasks with the fetched data
      } catch (error) {
        console.error("Error fetching tasks for the selected group:", error.message || error);
        alert("Failed to fetch tasks. Please try again.");
      }
    } else {
      console.error("Invalid group selected");
    }
  };
  
  const addTask = async (task) => {
    try {
      const response = await API.post("tasks/", {
        ...task,
        group: selectedGroup.id, // Ensure group ID is passed
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );

    if (updatedTask?.status === "completed") {
      const totalTime = updatedTask.useTimer
        ? updatedTask.time
        : calculateScheduledTime(updatedTask.schedule);

      setCompletedTasks((prevCompleted) => [
        ...prevCompleted,
        { ...updatedTask, time: totalTime },
      ]);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  const calculateScheduledTime = (schedule) => {
    if (!schedule) return 0;
    const [start, end] = schedule.split("-").map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    });
    const durationInMinutes = end - start;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return { hours, minutes };
  };

  return (
    <Router>
      <div className="app-container">
        {!isAuthenticated ? (
          <Routes>
            <Route path="*" element={<Login onAuthenticate={handleLogin} />} />
          </Routes>
        ) : (
          <>
            <Header onLogout={handleLogout} onGroupSelect={handleGroupSelect} />
            <Routes>
              <Route
                path="/"
                element={
                  selectedGroup ? (
                    <main className="app-main">
                      <div className="task-form-section">
                        <h2 className="centered-heading">Create Task</h2>
                        <TaskForm addTask={addTask} selectedGroup={selectedGroup} />
                      </div>
                      <div className="task-lists-container">
                        <div className="current-tasks-section">
                          <TaskList
                            tasks={tasks}
                            updateTask={updateTask}
                            assignUser={(id, user) => {
                              setTasks((prevTasks) =>
                                prevTasks.map((task) =>
                                  task.id === id
                                    ? { ...task, assignedTo: [...task.assignedTo, user] }
                                    : task
                                )
                              );
                            }}
                            selectedGroup={selectedGroup}
                          />
                        </div>
                        <div className="completed-tasks-section">
                          <CompletedTasks completedTasks={completedTasks} />
                        </div>
                      </div>
                    </main>
                  ) : (
                    <Navigate to="/groups" replace />
                  )
                }
              />
              <Route
                path="/groups"
                element={<GroupSelection onGroupSelect={handleGroupSelect} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
