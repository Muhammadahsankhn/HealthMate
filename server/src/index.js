require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

let dbMode = 'memory';
let TodoModel = null;
const inMemoryTodos = [];

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

async function connectMongo() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI not set; using in-memory store');
    return;
  }
  try {
    await mongoose.connect(mongoUri, { autoIndex: true });
    TodoModel = mongoose.model('Todo', todoSchema);
    dbMode = 'mongo';
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('Failed to connect to MongoDB, using in-memory store:', err.message);
  }
}

app.get('/api/health', async (_req, res) => {
  const dbOk = dbMode === 'mongo' ? mongoose.connection.readyState === 1 : true;
  res.json({ status: 'ok', db: dbMode, dbOk });
});

app.get('/api/todos', async (_req, res) => {
  try {
    if (dbMode === 'mongo' && TodoModel) {
      const todos = await TodoModel.find().sort({ createdAt: -1 });
      return res.json(todos);
    }
    return res.json(inMemoryTodos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  try {
    if (dbMode === 'mongo' && TodoModel) {
      const todo = await TodoModel.create({ title });
      return res.status(201).json(todo);
    }
    const todo = { id: String(Date.now()), title, completed: false, createdAt: new Date().toISOString() };
    inMemoryTodos.unshift(todo);
    return res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body || {};
  try {
    if (dbMode === 'mongo' && TodoModel) {
      const todo = await TodoModel.findByIdAndUpdate(
        id,
        { ...(typeof completed === 'boolean' ? { completed } : {}), ...(title ? { title } : {}) },
        { new: true }
      );
      if (!todo) return res.status(404).json({ error: 'Not found' });
      return res.json(todo);
    }
    const idx = inMemoryTodos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    if (typeof completed === 'boolean') inMemoryTodos[idx].completed = completed;
    if (title) inMemoryTodos[idx].title = title;
    return res.json(inMemoryTodos[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (dbMode === 'mongo' && TodoModel) {
      const result = await TodoModel.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'Not found' });
      return res.status(204).end();
    }
    const idx = inMemoryTodos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    inMemoryTodos.splice(idx, 1);
    return res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectMongo().finally(() => {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
});
