import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types';

/**
 * Storage Service Interface (Interface Segregation Principle)
 * Defines the contract for storage implementations
 * This allows for different storage backends (MMKV, AsyncStorage, etc.)
 */
export interface IStorageService {
  /** Get all todos */
  getAll(): Promise<Todo[]>;
  /** Get a single todo by ID */
  getById(id: string): Promise<Todo | null>;
  /** Create a new todo */
  create(dto: CreateTodoDTO): Promise<Todo>;
  /** Update an existing todo */
  update(id: string, dto: UpdateTodoDTO): Promise<Todo | null>;
  /** Delete a todo */
  delete(id: string): Promise<boolean>;
  /** Clear all todos */
  clear(): Promise<void>;
}

/**
 * Todo Repository Interface (Dependency Inversion Principle)
 * Higher-level abstraction for todo operations
 */
export interface ITodoRepository {
  getAll(): Promise<Todo[]>;
  getById(id: string): Promise<Todo | null>;
  create(dto: CreateTodoDTO): Promise<Todo>;
  update(id: string, dto: UpdateTodoDTO): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
}

/**
 * ID Generator Interface (Single Responsibility Principle)
 * Responsible for generating unique identifiers
 */
export interface IIdGenerator {
  generate(): string;
}

/**
 * Timestamp Provider Interface (Single Responsibility Principle)
 * Responsible for providing current timestamps
 */
export interface ITimestampProvider {
  now(): string;
}
