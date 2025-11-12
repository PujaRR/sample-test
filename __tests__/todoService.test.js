/**
 * Unit tests for TodoService
 * Tests all CRUD operations and business logic
 */

const TodoService = require('../src/todoService');

describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    todoService = new TodoService();
  });

  describe('createTodo', () => {
    test('should create a todo with title only', () => {
      const todo = todoService.createTodo('Test Todo');
      expect(todo).toHaveProperty('id');
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
      expect(todo).toHaveProperty('createdAt');
      expect(todo).toHaveProperty('updatedAt');
    });

    test('should create a todo with title and description', () => {
      const todo = todoService.createTodo('Test Todo', 'Test Description');
      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Test Description');
    });

    test('should trim whitespace from title and description', () => {
      const todo = todoService.createTodo('  Test Todo  ', '  Description  ');
      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Description');
    });

    test('should throw error for empty title', () => {
      expect(() => todoService.createTodo('')).toThrow('Title is required');
      expect(() => todoService.createTodo('   ')).toThrow('Title is required');
    });

    test('should throw error for non-string title', () => {
      expect(() => todoService.createTodo(null)).toThrow('Title is required');
      expect(() => todoService.createTodo(123)).toThrow('Title is required');
      expect(() => todoService.createTodo(undefined)).toThrow('Title is required');
    });

    test('should increment ID for each todo', () => {
      const todo1 = todoService.createTodo('Todo 1');
      const todo2 = todoService.createTodo('Todo 2');
      expect(todo2.id).toBe(todo1.id + 1);
    });
  });

  describe('getAllTodos', () => {
    test('should return empty array initially', () => {
      const todos = todoService.getAllTodos();
      expect(todos).toEqual([]);
    });

    test('should return all todos', () => {
      todoService.createTodo('Todo 1');
      todoService.createTodo('Todo 2');
      const todos = todoService.getAllTodos();
      expect(todos.length).toBe(2);
    });
  });

  describe('getTodoById', () => {
    test('should return todo by ID', () => {
      const created = todoService.createTodo('Test Todo');
      const found = todoService.getTodoById(created.id);
      expect(found).toEqual(created);
    });

    test('should return null for non-existent ID', () => {
      const found = todoService.getTodoById(999);
      expect(found).toBeNull();
    });
  });

  describe('updateTodo', () => {
    test('should update todo title', () => {
      const todo = todoService.createTodo('Original Title');
      const updated = todoService.updateTodo(todo.id, { title: 'Updated Title' });
      expect(updated.title).toBe('Updated Title');
      expect(updated.updatedAt).not.toBe(todo.updatedAt);
    });

    test('should update todo description', () => {
      const todo = todoService.createTodo('Test', 'Original');
      const updated = todoService.updateTodo(todo.id, { description: 'Updated' });
      expect(updated.description).toBe('Updated');
    });

    test('should update todo completed status', () => {
      const todo = todoService.createTodo('Test');
      const updated = todoService.updateTodo(todo.id, { completed: true });
      expect(updated.completed).toBe(true);
    });

    test('should update multiple fields', () => {
      const todo = todoService.createTodo('Original', 'Desc');
      const updated = todoService.updateTodo(todo.id, {
        title: 'New Title',
        description: 'New Desc',
        completed: true
      });
      expect(updated.title).toBe('New Title');
      expect(updated.description).toBe('New Desc');
      expect(updated.completed).toBe(true);
    });

    test('should return null for non-existent ID', () => {
      const updated = todoService.updateTodo(999, { title: 'New' });
      expect(updated).toBeNull();
    });

    test('should throw error for invalid title', () => {
      const todo = todoService.createTodo('Test');
      expect(() => todoService.updateTodo(todo.id, { title: '' })).toThrow('Title must be a non-empty string');
      expect(() => todoService.updateTodo(todo.id, { title: '   ' })).toThrow('Title must be a non-empty string');
    });

    test('should throw error for invalid completed value', () => {
      const todo = todoService.createTodo('Test');
      expect(() => todoService.updateTodo(todo.id, { completed: 'true' })).toThrow('Completed must be a boolean');
    });

    test('should trim whitespace from updated title', () => {
      const todo = todoService.createTodo('Test');
      const updated = todoService.updateTodo(todo.id, { title: '  Updated  ' });
      expect(updated.title).toBe('Updated');
    });
  });

  describe('deleteTodo', () => {
    test('should delete todo by ID', () => {
      const todo = todoService.createTodo('Test');
      const deleted = todoService.deleteTodo(todo.id);
      expect(deleted).toBe(true);
      expect(todoService.getTodoById(todo.id)).toBeNull();
    });

    test('should return false for non-existent ID', () => {
      const deleted = todoService.deleteTodo(999);
      expect(deleted).toBe(false);
    });

    test('should remove todo from list', () => {
      const todo1 = todoService.createTodo('Todo 1');
      const todo2 = todoService.createTodo('Todo 2');
      todoService.deleteTodo(todo1.id);
      const todos = todoService.getAllTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].id).toBe(todo2.id);
    });
  });

  describe('getCompletedTodos', () => {
    test('should return only completed todos', () => {
      const todo1 = todoService.createTodo('Todo 1');
      const todo2 = todoService.createTodo('Todo 2');
      todoService.updateTodo(todo1.id, { completed: true });
      const completed = todoService.getCompletedTodos();
      expect(completed.length).toBe(1);
      expect(completed[0].id).toBe(todo1.id);
    });

    test('should return empty array when no completed todos', () => {
      todoService.createTodo('Todo 1');
      const completed = todoService.getCompletedTodos();
      expect(completed).toEqual([]);
    });
  });

  describe('getPendingTodos', () => {
    test('should return only pending todos', () => {
      const todo1 = todoService.createTodo('Todo 1');
      const todo2 = todoService.createTodo('Todo 2');
      todoService.updateTodo(todo1.id, { completed: true });
      const pending = todoService.getPendingTodos();
      expect(pending.length).toBe(1);
      expect(pending[0].id).toBe(todo2.id);
    });

    test('should return all todos when none are completed', () => {
      todoService.createTodo('Todo 1');
      todoService.createTodo('Todo 2');
      const pending = todoService.getPendingTodos();
      expect(pending.length).toBe(2);
    });
  });

  describe('clearAll', () => {
    test('should remove all todos', () => {
      todoService.createTodo('Todo 1');
      todoService.createTodo('Todo 2');
      const count = todoService.clearAll();
      expect(count).toBe(2);
      expect(todoService.getAllTodos()).toEqual([]);
    });

    test('should return 0 when no todos exist', () => {
      const count = todoService.clearAll();
      expect(count).toBe(0);
    });
  });
});

