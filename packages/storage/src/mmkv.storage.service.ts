import type { IStorageService, Todo } from '@todo-list/core';

/**
 * MMKV Storage Service Implementation
 * Implements IStorageService interface from core package
 * Follows Single Responsibility Principle - handles storage operations only
 * Follows Dependency Inversion Principle - depends on MMKV abstraction
 */
export class MmkvStorageService implements IStorageService {
  private todos: Todo[] = [];

  /**
   * Initialize storage with MMKV instance
   * Note: MMKV must be initialized in the React Native app before using this service
   */
  initialize(initialTodos: Todo[] = []): void {
    this.todos = initialTodos;
  }

  /**
   * Get all todos from storage
   */
  async getAll(): Promise<Todo[]> {
    return [...this.todos];
  }

  /**
   * Get a single todo by ID
   */
  async getById(id: string): Promise<Todo | null> {
    const todo = this.todos.find(t => t.id === id);
    return todo ?? null;
  }

  /**
   * Create a new todo
   */
  async create(todo: Todo): Promise<Todo> {
    this.todos.push(todo);
    return todo;
  }

  /**
   * Update an existing todo
   */
  async update(id: string, todo: Todo): Promise<Todo | null> {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      return null;
    }
    this.todos[index] = todo;
    return todo;
  }

  /**
   * Delete a todo by ID
   */
  async delete(id: string): Promise<boolean> {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      return false;
    }
    this.todos.splice(index, 1);
    return true;
  }

  /**
   * Clear all todos
   */
  async clear(): Promise<void> {
    this.todos = [];
  }
}

/**
 * In-memory storage service for testing purposes
 * Useful for unit tests without MMKV dependency
 */
export class InMemoryStorageService implements IStorageService {
  private todos: Map<string, Todo> = new Map();

  async getAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async getById(id: string): Promise<Todo | null> {
    return this.todos.get(id) ?? null;
  }

  async create(todo: Todo): Promise<Todo> {
    this.todos.set(todo.id, todo);
    return todo;
  }

  async update(id: string, todo: Todo): Promise<Todo | null> {
    if (!this.todos.has(id)) {
      return null;
    }
    this.todos.set(id, todo);
    return todo;
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }

  async clear(): Promise<void> {
    this.todos.clear();
  }
}

/**
 * Factory function to create MMKV storage service
 */
export function createMmkvStorageService(): MmkvStorageService {
  return new MmkvStorageService();
}

/**
 * Factory function to create in-memory storage service (for testing)
 */
export function createInMemoryStorageService(): InMemoryStorageService {
  return new InMemoryStorageService();
}
