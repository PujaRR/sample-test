/**
 * Todo API Server
 * Express application for managing todo items
 */

const express = require('express');
const bodyParser = require('body-parser');
const TodoService = require('./todoService');

const app = express();
const todoService = new TodoService();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Todo API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      getAllTodos: 'GET /api/todos',
      getTodo: 'GET /api/todos/:id',
      createTodo: 'POST /api/todos',
      updateTodo: 'PUT /api/todos/:id',
      deleteTodo: 'DELETE /api/todos/:id',
      getCompleted: 'GET /api/todos/completed',
      getPending: 'GET /api/todos/pending'
    }
  });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const todos = todoService.getAllTodos();
    res.json({ 
      success: true, 
      count: todos.length, 
      todos 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get todo by ID
app.get('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format' 
      });
    }

    const todo = todoService.getTodoById(id);
    if (!todo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }

    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create todo
app.post('/api/todos', (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = todoService.createTodo(title, description);
    res.status(201).json({ 
      success: true, 
      todo 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format' 
      });
    }

    const todo = todoService.updateTodo(id, req.body);
    if (!todo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }

    res.json({ success: true, todo });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format' 
      });
    }

    const deleted = todoService.deleteTodo(id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Todo deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get completed todos
app.get('/api/todos/completed', (req, res) => {
  try {
    const todos = todoService.getCompletedTodos();
    res.json({ 
      success: true, 
      count: todos.length, 
      todos 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get pending todos
app.get('/api/todos/pending', (req, res) => {
  try {
    const todos = todoService.getPendingTodos();
    res.json({ 
      success: true, 
      count: todos.length, 
      todos 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Todo API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;

