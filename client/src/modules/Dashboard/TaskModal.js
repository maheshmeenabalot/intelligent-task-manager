import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, onClose, onCollaboratorAdded }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(task.collaborators);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users', { method: 'GET' });
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const resData = await res.json();
        setUsers(resData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${task._id}/collaborators`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collaborators: selectedUsers })
      });
      const updatedTask = await res.json();
      if (!res.ok) {
        throw new Error(`Failed to update task: ${updatedTask.message}`);
      }
      onCollaboratorAdded(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center'>
      <div className='bg-white p-6 rounded shadow-lg w-1/2'>
        <h2 className='text-2xl font-bold mb-4'>Add Collaborators</h2>
        <div className='mb-4'>
          {users.map((user) => (
            <div key={user._id} className='flex items-center'>
              <input
                type='checkbox'
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleChange(user._id)}
                className='mr-2'
              />
              <label>{user.fullName} ({user.email})</label>
            </div>
          ))}
        </div>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
