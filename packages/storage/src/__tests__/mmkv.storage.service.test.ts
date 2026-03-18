import { InMemoryStorageService } from '../mmkv.storage.service';
import { TodoStatus, TodoPriority } from '@todo-list/core';

describe('InMemoryStorageService', () => {
  let storage: InMemoryStorageService;

  beforeEach(() => {
    storage = new InMemoryStorageService();
  });

  const createTestTodo = (id: string, title: string) => ({
    id,
    title,
    status: TodoStatus.PENDING,
    priority: TodoPriority.MEDIUM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  describe('getAll', () => {
    it('should return empty array initially', async () => {
      const todos = await storage.getAll();
      expect(todos).toEqual([]);
    });

    it('should return all stored todos', async () => {
      await storage.create(createTestTodo('1', 'Todo 1'));
      await storage.create(createTestTodo('2', 'Todo 2'));
      const todos = await storage.getAll();
      expect(todos.length).toBe(2);
    });
  });

  describe('getById', () => {
    it('should return null for non-existent todo', async () => {
      const todo = await storage.getById('non-existent');
      expect(todo).toBeNull();
    });

    it('should return the correct todo', async () => {
      const todo = createTestTodo('1', 'Test Todo');
      await storage.create(todo);
      const found = await storage.getById('1');
      expect(found).toEqual(todo);
    });
  });

  describe('create', () => {
    it('should create and return a todo', async () => {
      const todo = createTestTodo('1', 'Test Todo');
      const created = await storage.create(todo);
      expect(created).toEqual(todo);
    });
  });

  describe('update', () => {
    it('should return null for non-existent todo', async () => {
      const todo = createTestTodo('1', 'Test Todo');
      const updated = await storage.update('non-existent', todo);
      expect(updated).toBeNull();
    });

    it('should update and return the todo', async () => {
      await storage.create(createTestTodo('1', 'Original'));
      const updated = createTestTodo('1', 'Updated');
      const result = await storage.update('1', updated);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should return false for non-existent todo', async () => {
      const result = await storage.delete('non-existent');
      expect(result).toBe(false);
    });

    it('should delete and return true', async () => {
      await storage.create(createTestTodo('1', 'Test Todo'));
      const result = await storage.delete('1');
      expect(result).toBe(true);
      const todo = await storage.getById('1');
      expect(todo).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all todos', async () => {
      await storage.create(createTestTodo('1', 'Todo 1'));
      await storage.create(createTestTodo('2', 'Todo 2'));
      await storage.clear();
      const todos = await storage.getAll();
      expect(todos).toEqual([]);
    });
  });
});
