import React from 'react';

const TaskList = ({ tasks, handleEditTask, handleDeleteTask, handleAddCollaborator }) => {
  return (
    
    <div className='space-y-6'>
      {tasks.map((task) => (
        <div key={task._id} className='bg-white shadow-md rounded-lg overflow-hidden'>
          <div className='p-6 bg-gray-100'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-semibold text-gray-900'>{task.task}</h3>
              <div className='space-x-4'>
                <button
                  onClick={() => handleEditTask(task)}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAddCollaborator(task)}
                  className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
                >
                  Add Collaborators
                </button>
              </div>
            </div>
          </div>
          <div className='p-6 bg-white'>
            <p className='text-gray-800 mb-4'>{task.description}</p>
            <div className='text-sm text-gray-600 grid grid-cols-2 gap-4'>
              <p className='flex items-center'>
                <span className='font-semibold mr-2'>Due Date:</span> {task.dueDate}
              </p>
              <p className='flex items-center'>
                <span className='font-semibold mr-2'>Priority:</span> {task.priority}
              </p>
              <p className='flex items-center'>
                <span className='font-semibold mr-2'>Status:</span> {task.status}
              </p>
              <p className='flex items-center col-span-2'>
                <span className='font-semibold mr-2'>Collaborators:</span> {task.collaborators.join(', ')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
