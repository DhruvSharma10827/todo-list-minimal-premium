import {
  ITodoRepository,
  createTodoRepository,
  createIdGenerator,
  createTimestampProvider,
} from '@todo-list/core';
import {
  createMmkvStorageService,
  MmkvStorageService,
} from '@todo-list/storage';

/**
 * Singleton instance of the todo repository
 */
let repositoryInstance: ITodoRepository | null = null;
let storageInstance: MmkvStorageService | null = null;

/**
 * Initialize the todo repository
 * This should be called once when the app starts
 */
export function initializeTodoRepository(): ITodoRepository {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  const storage = createMmkvStorageService();
  const idGenerator = createIdGenerator();
  const timestampProvider = createTimestampProvider();

  storageInstance = storage;
  repositoryInstance = createTodoRepository(
    storage,
    idGenerator,
    timestampProvider,
  );

  return repositoryInstance;
}

/**
 * Get the todo repository instance
 */
export function getTodoRepository(): ITodoRepository {
  if (!repositoryInstance) {
    return initializeTodoRepository();
  }
  return repositoryInstance;
}

/**
 * Get the storage service instance
 */
export function getStorageService(): MmkvStorageService | null {
  return storageInstance;
}
