require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();

// MongoDB Connection 
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tododbs';
console.log("Connecting to MongoDB at:", MONGODB_URI);

const mongooseOptions = {
  family: 4,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ Connection failed:', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // تغيير ليطابق port الواجهة
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
const Todo = require('./models/todo');

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  try {
    const todo = new Todo({
      content: req.body.content,
      complete: false
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { complete: req.body.complete },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




