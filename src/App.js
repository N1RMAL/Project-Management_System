import React, { useState } from "react";
import TaskForm from "./components/js/TaskForm";
import TaskList from "./components/js/TaskList";
import CompletedTasks from "./components/js/CompletedTasks";
import LoginRegister from "./components/js/LoginRegister";
import Header from "./components/js/Header";
import GroupSelection from "./components/js/GroupSelection";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [users, setUsers] = useState(["You"]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedGroup(null);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setTasks([]); // Reset tasks for new group
    setCompletedTasks([]); // Reset completed tasks for new group
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, status: "todo", assignedTo: [], time: 0 }]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === id ? { ...task, ...updatedTask } : task
      )
    );

    if (updatedTask.status === "completed") {
      setCompletedTasks((prevCompleted) => [
        ...prevCompleted,
        { ...updatedTask, time: updatedTask.time || 0 },
      ]);
      setTasks((prevTasks) => prevTasks.filter((_, index) => index !== id));
    }
  };

  const addUser = (user) => {
    if (!users.includes(user)) {
      setUsers([...users, user]);
    }
  };

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <LoginRegister onAuthenticate={handleLogin} />
      ) : (
        <>
          <Header onLogout={handleLogout} onGroupSelect={handleGroupSelect} />
          {!selectedGroup ? (
            <GroupSelection onGroupSelect={handleGroupSelect} />
          ) : (
            <main className="app-main">
              <div className="task-section">
                <TaskForm addTask={addTask} users={users} addUser={addUser} />
                <TaskList tasks={tasks} updateTask={updateTask} users={users} />
              </div>
              <div className="completed-section">
                <CompletedTasks completedTasks={completedTasks} />
              </div>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default App;