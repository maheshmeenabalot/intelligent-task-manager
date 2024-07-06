const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const connectDB = require('./db/connection');
const Users = require('./module/Users');
const Task = require('./module/Task');

// Connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Welcome');
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    
    const isAlreadyExist = await Users.findOne({ email });
    if (isAlreadyExist) {
      return res.status(400).json({ message: 'User already exists, please sign in' });
    } else {
      const hashedPassword = await bcryptjs.hash(password, 6);
      const newUser = new Users({
        fullName,
        email,
        password: hashedPassword
      });
      await newUser.save();
      return res.status(200).json({ message: 'New user is registered successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist, please sign up" });
    }

    const validateUser = await bcryptjs.compare(password, user.password);
    if (!validateUser) {
      return res.status(400).json({ message: "User email or password is incorrect" });
    }

    const payload = {
      userID: user._id,
      email: user.email
    };
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
      if (err) {
        return res.status(400).json({ message: "Error generating token" });
      }

      await Users.updateOne({ _id: user.id }, { $set: { token } });
      return res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email, fullName: user.fullName }, token: token });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const { userId, task, description, dueDate, priority, status, collaborators } = req.body;
    if (!userId || !task) {
      return res.status(400).json({ message: 'User ID and Task name are required' });
    }

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const newTask = new Task({ userId, task, description, dueDate, priority, status, collaborators });
    await newTask.save();
    io.emit('taskAdded', newTask); // Emit taskAdded event
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all tasks by user ID
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ 
      $or: [
        { userId: req.params.userId },
        { collaborators: req.params.userId }
      ]
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error, 'Error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get task by ID
app.get('/api/task/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.log(error, 'Error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    io.emit('taskUpdated', task); // Emit event after updating task
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add collaborators to a task
app.put('/api/tasks/:id/collaborators', async (req, res) => {
  try {
    const { collaborators } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { collaborators: { $each: collaborators } } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    io.emit('taskUpdated', task); // Emit event after updating task
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await Users.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
