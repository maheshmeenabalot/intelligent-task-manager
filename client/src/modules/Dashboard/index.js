import React, { useEffect, useState } from 'react';
import avatar from '../../assets/avatar.svg';
import { io } from 'socket.io-client';
import TaskList from './TaskList';
import SearchAndFilters from './SearchAndFilters';
import TaskModal from './TaskModal';
import TaskForm from './TaskForm';

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
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false); // For task form modal

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
        setIsTaskFormVisible(false); // Hide the task form modal after adding/updating
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
    setIsTaskFormVisible(true); // Show the task form modal when editing a task
  };

  const handleAddCollaborator = (task) => {
    setSelectedTask(task);
  };

  const handleCollaboratorAdded = async (updatedTask) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(`Error updating task: ${resData.message}`);
      } else {
        setTasks((prevTasks) => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        socket.emit('taskUpdated', resData);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message);
    }
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
          <button
            onClick={() => setIsTaskFormVisible(true)}
            className='w-full bg-blue-500 text-white py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Add Task
          </button>
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
          {isTaskFormVisible && (
            <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
              <div className='bg-white p-8 rounded-lg shadow-lg w-1/2'>
                <h2 className='text-xl font-bold mb-4'>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
                <TaskForm
                  newTask={newTask}
                  handleInputChange={handleInputChange}
                  handleAddOrUpdateTask={handleAddOrUpdateTask}
                  editingTask={editingTask}
                  setIsTaskFormVisible={setIsTaskFormVisible} // Pass function to close modal
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
