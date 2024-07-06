// components/TaskList.js

import React from 'react';

const TaskList = ({ tasks, handleEditTask, handleDeleteTask, handleAddCollaborator }) => { // Added handleAddCollaborator
  return (
    <div className='space-y-4'>
      {tasks.map((task) => (
        <div key={task._id} className='p-4 bg-white rounded shadow'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-bold'>{task.task}</h3>
            <div className='space-x-2'>
              <button
                onClick={() => handleEditTask(task)}
                className='text-blue-500 hover:underline'
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className='text-red-500 hover:underline'
              >
                Delete
              </button>
              <button
                onClick={() => handleAddCollaborator(task)} // Added this line
                className='text-green-500 hover:underline'
              >
                Add Collaborators
              </button>
            </div>
          </div>
          <p>{task.description}</p>
          <div className='text-sm text-gray-500'>
            <p>Due Date: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            <p>Collaborators: {task.collaborators.join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
