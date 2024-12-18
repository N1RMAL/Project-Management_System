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
    setTasks([...tasks, { ...task, id: tasks.length, status: "todo", assignedTo: [], time: 0, schedule: null, useTimer: true }]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
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
        task.id === id
          ? { ...task, assignedTo: [...task.assignedTo, user] }
          : task
      )
    );
  };

  const addUser = (user) => {
    if (!users.includes(user)) {
      setUsers([...users, user]);
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
              <div className="task-form-section">
                <div className="task-creation">
                  <h2 className="centered-heading">Create Task</h2>
                  <TaskForm addTask={addTask} />
                </div>
                <div className="user-creation">
                  <h2 className="centered-heading">Add User</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const user = e.target.elements.username.value;
                      if (user.trim()) {
                        addUser(user.trim());
                        e.target.reset();
                      }
                    }}
                    className="centered-form"
                  >
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter user name"
                      required
                      className="centered-input"
                    />
                    <button type="submit" className="centered-button">Add User</button>
                  </form>
                </div>
              </div>
              <div className="task-lists-container">
                <div className="current-tasks-section">
                  <TaskList tasks={tasks} updateTask={updateTask} assignUser={assignUser} users={users} />
                </div>
                <div className="completed-tasks-section">
                  <CompletedTasks completedTasks={completedTasks} />
                </div>
              </div>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default App;