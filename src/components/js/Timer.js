import React, { useEffect, useState } from "react";
import "../css/Timer.css";

const Timer = ({ task, updateTask }) => {
  const [time, setTime] = useState(task.time || 0); // Initialize time with the task's current time
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      // Increment the timer every second if running
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && task.time !== time) {
      // Sync the time with the parent when the timer is stopped
      updateTask({ ...task, time });
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isRunning, time, task, updateTask]);

  const toggleTimer = () => {
    if (task.status !== "in-progress") {
      alert("Timer can only be started for tasks in progress.");
      return;
    }
    setIsRunning((prevState) => !prevState); // Toggle the timer
  };

  return (
    <div className="timer">
      <p>Time Spent: {time}s</p>
      <button onClick={toggleTimer} className="btn-primary">
        {isRunning ? "Pause" : "Start"} Timer
      </button>
    </div>
  );
};

export default Timer;
