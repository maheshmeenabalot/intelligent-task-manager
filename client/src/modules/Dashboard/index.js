import React, { useEffect, useState } from 'react';
import avatar from '../../assets/avatar.svg';
import { io } from 'socket.io-client';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SearchAndFilters from './SearchAndFilters';
import TaskModal from './TaskModal';

const socket = io('http://localhost:8000'); // Initialize Socket.io connection

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ task: '', description: '', dueDate: '', priority: 'low', status: 'pending', collaborators: [] });
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // For modal

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/tasks/${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          throw new Error(`Error fetching tasks: ${res.statusText}`);
        }
        const resData = await res.json();
        setTasks(resData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(error.message);
      }
    };
    fetchTasks();
    
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    });
    socket.on('taskAdded', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    return () => {
      socket.off('taskUpdated');
      socket.off('taskAdded');
    };
  }, [user.id]);

  const handleAddOrUpdateTask = async () => {
    if (newTask.task.trim() === '') {
      setError('Task name cannot be empty.');
      return;
    }

    try {
      const payload = { ...newTask, userId: user.id };
      const method = editingTask ? 'PUT' : 'POST';
      const url = editingTask ? `http://localhost:8000/api/tasks/${editingTask._id}` : 'http://localhost:8000/api/tasks';

      console.log('Payload:', payload);
      console.log('URL:', url);
      console.log('Method:', method);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(`Error adding/updating task: ${resData.message}`);
      } else {
        setNewTask({ task: '', description: '', dueDate: '', priority: 'low', status: 'pending', collaborators: [] });
        setEditingTask(null);
        setError(null); // Clear any previous errors
        if (method === 'POST') {
          socket.emit('taskAdded', resData);
        } else {
          socket.emit('taskUpdated', resData);
        }
      }
    } catch (error) {
      console.error('Error adding/updating task:', error);
      setError(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      console.error('Error: taskId is undefined');
      setError('Task ID is undefined');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId)); // Changed task.id to task._id
      } else {
        const resData = await res.json();
        throw new Error(`Error deleting task: ${resData.message}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleEditTask = (task) => {
    setNewTask({
      task: task.task,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      collaborators: task.collaborators,
    });
    setEditingTask(task);
  };

  const handleCollaboratorChange = (e) => {
    const { value } = e.target;
    setNewTask((prevTask) => {
      const collaborators = value.split(',').map((id) => id.trim());
      return { ...prevTask, collaborators };
    });
  };

  const handleAddCollaborator = (task) => {
    setSelectedTask(task);
  };

  const handleCollaboratorAdded = (updatedTask) => {
    setTasks((prevTasks) => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    setSelectedTask(null);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  useEffect(() => {
    console.log('Search Query:', searchQuery);
    console.log('Filter Status:', filterStatus);
    console.log('Filter Priority:', filterPriority);
  }, [searchQuery, filterStatus, filterPriority]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearchQuery = task.task.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status.toLowerCase() === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority.toLowerCase() === filterPriority;
    return matchesSearchQuery && matchesStatus && matchesPriority;
  });

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Sidebar */}
      <div className='w-1/4 h-full bg-gray-100 border-r border-gray-200'>
        <div className='p-8'>
          <div className='flex items-center space-x-4'>
            <img
              src={avatar}
              alt='User Avatar'
              className='w-12 h-12 rounded-full border-2 border-blue-300'
            />
            <div>
              <h3 className='text-xl font-bold'>{user?.fullName}</h3>
              <p className='text-gray-500'>My Account</p>
            </div>
          </div>
          <hr className='my-6 border-t border-gray-200' />
          <TaskForm
            newTask={newTask}
            handleInputChange={handleInputChange}
            handleAddOrUpdateTask={handleAddOrUpdateTask}
            editingTask={editingTask}
          />
          <div className='mt-4'>
            <label htmlFor='collaborators' className='block text-sm font-medium text-gray-700'>Collaborators (comma-separated user IDs)</label>
            <input
              type='text'
              name='collaborators'
              id='collaborators'
              value={newTask.collaborators.join(', ')}
              onChange={handleCollaboratorChange}
              className='mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300'
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-8'>
          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
          />
          <TaskList
            tasks={filteredTasks}
            handleDeleteTask={handleDeleteTask}
            handleEditTask={handleEditTask}
            handleAddCollaborator={handleAddCollaborator} // Added this line
          />
          {selectedTask && (
            <TaskModal
              task={selectedTask}
              onClose={handleCloseModal}
              onCollaboratorAdded={handleCollaboratorAdded}
            />
          )}
          {error && <div className='mt-4 p-4 bg-red-100 text-red-800 rounded'>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
