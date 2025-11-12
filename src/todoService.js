/**
 * Todo Service module
 * Provides business logic for managing todo items
 */

class TodoService {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  /**
   * Get all todo items
   * @returns {Array} Array of all todo items
   */
  getAllTodos() {
    return this.todos;
  }

  /**
   * Get a todo item by ID
   * @param {number} id - Todo item ID
   * @returns {Object|null} Todo item or null if not found
   */
  getTodoById(id) {
    const todo = this.todos.find(t => t.id === id);
    return todo || null;
  }

  /**
   * Create a new todo item
   * @param {string} title - Todo title
   * @param {string} description - Todo description (optional)
   * @returns {Object} Created todo item
   */
  createTodo(title, description = '') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }

    const todo = {
      id: this.nextId++,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.todos.push(todo);
    return todo;
  }

  /**
   * Update an existing todo item
   * @param {number} id - Todo item ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated todo item or null if not found
   */
  updateTodo(id, updates) {
    const todo = this.getTodoById(id);
    if (!todo) {
      return null;
    }

    if (updates.title !== undefined) {
      if (typeof updates.title !== 'string' || updates.title.trim().length === 0) {
        throw new Error('Title must be a non-empty string');
      }
      todo.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      todo.description = typeof updates.description === 'string' 
        ? updates.description.trim() 
        : '';
    }

    if (updates.completed !== undefined) {
      if (typeof updates.completed !== 'boolean') {
        throw new Error('Completed must be a boolean value');
      }
      todo.completed = updates.completed;
    }

    todo.updatedAt = new Date().toISOString();
    return todo;
  }

  /**
   * Delete a todo item
   * @param {number} id - Todo item ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      return false;
    }
    this.todos.splice(index, 1);
    return true;
  }

  /**
   * Get all completed todos
   * @returns {Array} Array of completed todo items
   */
  getCompletedTodos() {
    return this.todos.filter(t => t.completed);
  }

  /**
   * Get all pending todos
   * @returns {Array} Array of pending todo items
   */
  getPendingTodos() {
    return this.todos.filter(t => !t.completed);
  }

  /**
   * Clear all todos
   * @returns {number} Number of todos deleted
   */
  clearAll() {
    const count = this.todos.length;
    this.todos = [];
    return count;
  }
}

module.exports = TodoService;

