import React from "react";
import TaskCard from "./TaskCard";
import "../css/TaskList.css";

const TaskList = ({ tasks, updateTask, assignUser, users }) => {
  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks available. Create a task to get started!</p>
      ) : (
        tasks.map((task, index) => (
          <TaskCard
            key={index}
            task={{ ...task, id: index }} // Ensure id is passed
            updateTask={updateTask}
            assignUser={assignUser}
            users={users}
          />
        ))
      )}
    </div>
  );
};


export default TaskList;
