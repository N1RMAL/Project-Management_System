import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskForm from "./components/js/TaskForm";
import TaskList from "./components/js/TaskList";
import CompletedTasks from "./components/js/CompletedTasks";
import Login from "./components/js/Login";
import Header from "./components/js/Header";
import GroupSelection from "./components/js/GroupSelection";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token") // Check if user is logged in
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
    localStorage.removeItem("access_token"); // Clear stored token on logout
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setTasks([]); // Reset tasks for new group
    setCompletedTasks([]); // Reset completed tasks for new group
  };

  const addTask = (task) => {
    setTasks([
      ...tasks,
      {
        ...task,
        group: selectedGroup, // Automatically attach the selected group
        id: tasks.length,
        status: "todo",
        assignedTo: [],
        time: 0,
        schedule: null,
        useTimer: true,
      },
    ]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );

    if (updatedTask?.status === "completed") {
      if (updatedTask.useTimer && updatedTask.time === 0) {
        alert("Please stop the timer before completing the task.");
        return;
      }
      if (!updatedTask.useTimer && !updatedTask.schedule) {
        alert("Please set a schedule before completing the task.");
        return;
      }

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

  const assignUser = (id, user) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, assignedTo: [...task.assignedTo, user] } : task
      )
    );
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
                            assignUser={assignUser}
                          />
                        </div>
                        <div className="completed-tasks-section">
                          <CompletedTasks completedTasks={completedTasks} />
                        </div>
                      </div>
                    </main>
                  ) : (
                    <GroupSelection onGroupSelect={handleGroupSelect} />
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
