/**
 * Unit tests for Express API endpoints
 * Tests all HTTP endpoints and error handling
 */

const request = require('supertest');
const app = require('../src/index');

describe('Todo API', () => {
  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'OK',
        message: 'Todo API is running',
        timestamp: expect.any(String)
      });
    });
  });

  describe('GET /api/todos', () => {
    test('should return empty array initially', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count', 0);
      expect(response.body.todos).toEqual([]);
    });

    test('should return all todos', async () => {
      await request(app).post('/api/todos').send({ title: 'Test Todo' });
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body.count).toBeGreaterThan(0);
    });
  });

  describe('POST /api/todos', () => {
    test('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'New Todo', description: 'Test description' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.todo).toHaveProperty('id');
      expect(response.body.todo.title).toBe('New Todo');
      expect(response.body.todo.description).toBe('Test description');
    });

    test('should create todo with title only', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Simple Todo' });
      expect(response.status).toBe(201);
      expect(response.body.todo.title).toBe('Simple Todo');
    });

    test('should return error for missing title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('should return error for empty title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '' });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todos/:id', () => {
    test('should return todo by ID', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' });
      const todoId = createResponse.body.todo.id;

      const response = await request(app).get(`/api/todos/${todoId}`);
      expect(response.status).toBe(200);
      expect(response.body.todo.id).toBe(todoId);
    });

    test('should return 404 for non-existent ID', async () => {
      const response = await request(app).get('/api/todos/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/todos/invalid');
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/todos/:id', () => {
    test('should update todo', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Original' });
      const todoId = createResponse.body.todo.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated', completed: true });
      expect(response.status).toBe(200);
      expect(response.body.todo.title).toBe('Updated');
      expect(response.body.todo.completed).toBe(true);
    });

    test('should return 404 for non-existent ID', async () => {
      const response = await request(app)
        .put('/api/todos/999')
        .send({ title: 'Updated' });
      expect(response.status).toBe(404);
    });

    test('should return error for invalid update data', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test' });
      const todoId = createResponse.body.todo.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: '' });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    test('should delete todo', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'To Delete' });
      const todoId = createResponse.body.todo.id;

      const response = await request(app).delete(`/api/todos/${todoId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      const getResponse = await request(app).get(`/api/todos/${todoId}`);
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 for non-existent ID', async () => {
      const response = await request(app).delete('/api/todos/999');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/todos/completed', () => {
    test('should return completed todos', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test' });
      const todoId = createResponse.body.todo.id;

      await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true });

      const response = await request(app).get('/api/todos/completed');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/todos/pending', () => {
    test('should return pending todos', async () => {
      await request(app)
        .post('/api/todos')
        .send({ title: 'Pending Todo' });

      const response = await request(app).get('/api/todos/pending');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('404 handler', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown/endpoint');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});

