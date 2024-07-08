import React, { useState, useEffect } from 'react';
import { searchUsersByName, fetchCollaboratorDetails } from './TaskModelApi'; // Adjust the import path as necessary

const TaskModal = ({ task, onClose, onCollaboratorAdded }) => {
  const [collaborator, setCollaborator] = useState('');
  const [collaboratorDetails, setCollaboratorDetails] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await Promise.all(task.collaborators.map(id => fetchCollaboratorDetails(id)));
        const detailsMap = details.reduce((acc, detail) => {
          acc[detail._id] = detail; // Ensure this matches your user model's ID field
          return acc;
        }, {});
        setCollaboratorDetails(detailsMap);
      } catch (error) {
        console.error('Error fetching collaborator details:', error);
      }
    };

    fetchDetails();
  }, [task.collaborators]);

  const handleSearchChange = async (e) => {
    setCollaborator(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsersByName(e.target.value);
      setSearchResults(results);
      console.log(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddCollaborator = (user) => {
    if (task.collaborators.includes(user._id)) return;
    const updatedTask = { ...task, collaborators: [...task.collaborators, user._id] };
    onCollaboratorAdded(updatedTask);
    setCollaborator('');
    setSearchResults([]);
  };

  const handleRemoveCollaborator = (collaboratorToRemove) => {
    const updatedTask = { ...task, collaborators: task.collaborators.filter(col => col !== collaboratorToRemove) };
    onCollaboratorAdded(updatedTask);
  };

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden w-3/4 md:w-1/2 lg:w-1/3'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-4'>Manage Collaborators</h2>
          <div className='mb-4'>
            <input
              type='text'
              value={collaborator}
              onChange={handleSearchChange}
              className='w-full p-3 rounded border border-gray-300 focus:border-blue-500 focus:outline-none'
              placeholder='Search collaborator by name...'
            />
            {searchResults.length > 0 && (
              <ul className='mt-2 border border-gray-300 rounded bg-white'>
                {searchResults.map((user) => (
                  <li key={user._id} className='flex justify-between items-center p-2 hover:bg-gray-100'>
                    {user.fullName}
                    <button
                      onClick={() => handleAddCollaborator(user)}
                      className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition'
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <h3 className='text-lg font-semibold mb-2'>Current Collaborators</h3>
          <ul className='divide-y divide-gray-200'>
            {task.collaborators.map((col) => (
              <li key={col} className='flex justify-between items-center py-2'>
                <span>{collaboratorDetails[col]?.fullName || col}</span>
                <button
                  onClick={() => handleRemoveCollaborator(col)}
                  className='text-red-500 hover:text-red-700 transition'
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='bg-gray-50 px-6 py-3 flex justify-end'>
          <button
            onClick={onClose}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
