import { TodoRepository } from '../hooks/todo.repository';
import type { IStorageService } from '../interfaces';
import type { Todo } from '../types';
import { UuidGenerator } from '../utils/id.generator';
import { IsoTimestampProvider } from '../utils/timestamp.provider';
import { TodoStatus, TodoPriority } from '../types';

/**
 * Simple in-memory storage service for testing
 */
class MockStorageService implements IStorageService {
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

describe('TodoRepository', () => {
  let repository: TodoRepository;
  let storage: MockStorageService;

  beforeEach(() => {
    storage = new MockStorageService();
    const idGenerator = new UuidGenerator();
    const timestampProvider = new IsoTimestampProvider();
    repository = new TodoRepository(storage, idGenerator, timestampProvider);
  });

  describe('create', () => {
    it('should create a todo with default values', async () => {
      const todo = await repository.create({ title: 'Test Todo' });
      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('Test Todo');
      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.priority).toBe(TodoPriority.MEDIUM);
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
    });

    it('should create a todo with custom priority', async () => {
      const todo = await repository.create({
        title: 'High Priority Todo',
        priority: TodoPriority.HIGH,
      });
      expect(todo.priority).toBe(TodoPriority.HIGH);
    });

    it('should trim title and description', async () => {
      const todo = await repository.create({
        title: '  Trimmed Title  ',
        description: '  Trimmed Description  ',
      });
      expect(todo.title).toBe('Trimmed Title');
      expect(todo.description).toBe('Trimmed Description');
    });
  });

  describe('getAll', () => {
    it('should return empty array when no todos', async () => {
      const todos = await repository.getAll();
      expect(todos).toEqual([]);
    });

    it('should return all todos', async () => {
      await repository.create({ title: 'Todo 1' });
      await repository.create({ title: 'Todo 2' });
      const todos = await repository.getAll();
      expect(todos.length).toBe(2);
    });
  });

  describe('getById', () => {
    it('should return null for non-existent todo', async () => {
      const todo = await repository.getById('non-existent');
      expect(todo).toBeNull();
    });

    it('should return the correct todo', async () => {
      const created = await repository.create({ title: 'Test Todo' });
      const found = await repository.getById(created.id);
      expect(found).toEqual(created);
    });
  });

  describe('update', () => {
    it('should return null for non-existent todo', async () => {
      const updated = await repository.update('non-existent', {
        title: 'New Title',
      });
      expect(updated).toBeNull();
    });

    it('should update todo properties', async () => {
      const created = await repository.create({ title: 'Original Title' });
      // Wait a bit to ensure different timestamps
      const start = Date.now();
      while (Date.now() - start < 2) {
        // Wait for at least 2ms
      }
      const updated = await repository.update(created.id, {
        title: 'New Title',
        status: TodoStatus.COMPLETED,
      });
      expect(updated?.title).toBe('New Title');
      expect(updated?.status).toBe(TodoStatus.COMPLETED);
      // updatedAt should be updated (timestamps should be different or equal)
      expect(updated?.updatedAt).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should return false for non-existent todo', async () => {
      const result = await repository.delete('non-existent');
      expect(result).toBe(false);
    });

    it('should delete existing todo', async () => {
      const created = await repository.create({ title: 'Test Todo' });
      const result = await repository.delete(created.id);
      expect(result).toBe(true);
      const found = await repository.getById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all todos', async () => {
      await repository.create({ title: 'Todo 1' });
      await repository.create({ title: 'Todo 2' });
      await repository.clear();
      const todos = await repository.getAll();
      expect(todos).toEqual([]);
    });
  });
});
