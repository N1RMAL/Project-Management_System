// components/js/Timer.js
import React, { useState, useEffect } from "react";
import "../css/Timer.css";

const Timer = ({ task, updateTask }) => {
  const [time, setTime] = useState(task.time || 0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          updateTask(task.id, { time: newTime }); // Update task time
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, updateTask, task.id]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    setIsRunning(false);
    updateTask(task.id, { ...task, time }); // Save final time
  };

  return (
    <div className="timer">
      <p>Time Spent: {Math.floor(time / 60)} min {time % 60} sec</p>
      <button onClick={toggleTimer} className="btn-timer">
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={stopTimer} className="btn-timer-stop">
        Stop Timer
      </button>
    </div>
  );
};

export default Timer;
