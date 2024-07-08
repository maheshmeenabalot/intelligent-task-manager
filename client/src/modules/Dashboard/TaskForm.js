import React from 'react';

const TaskForm = ({ newTask, handleInputChange, handleAddOrUpdateTask, editingTask }) => {
  return (
    <div className='p-8 bg-white rounded-lg shadow-md'>
      <div className='mb-4'>
        <input
          placeholder='Type a task...'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='task'
          value={newTask.task}
          onChange={handleInputChange}
        />
      </div>
      <div className='mb-4'>
        <textarea
          placeholder='Description...'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='description'
          value={newTask.description}
          onChange={handleInputChange}
        />
      </div>
      <div className='mb-4'>
        <input
          type='date'
          placeholder='Due Date...'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='dueDate'
          value={newTask.dueDate}
          onChange={handleInputChange}
        />
      </div>
      <div className='mb-4'>
        <select
          name='priority'
          value={newTask.priority}
          onChange={handleInputChange}
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='Low'>Low</option>
          <option value='Medium'>Medium</option>
          <option value='High'>High</option>
        </select>
      </div>
      <div className='mb-4'>
        <select
          name='status'
          value={newTask.status}
          onChange={handleInputChange}
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='Pending'>Pending</option>
          <option value='In Progress'>In Progress</option>
          <option value='Completed'>Completed</option>
        </select>
      </div>
      <button
        onClick={handleAddOrUpdateTask}
        className='w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>
    </div>
  );
};

export default TaskForm;
