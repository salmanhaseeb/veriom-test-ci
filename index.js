const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

let todos = [];
let idCounter = 1;

// Hardcoded secret for vulnerability
const SECRET_KEY = 'supersecretkey123';

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  // No input validation - vulnerability
  const newTodo = { id: idCounter++, title, description };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const todo = todos.find(t => t.id == id);
  if (todo) {
    todo.title = title;
    todo.description = description;
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id != id);
  res.status(204).send();
});

// Expose ENV variables - vulnerability
app.get('/env', (req, res) => {
  res.json(process.env);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Secret key: ${SECRET_KEY}`); // Logging secret - vulnerability
});