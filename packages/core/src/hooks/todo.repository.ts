import type {
  ITodoRepository,
  IStorageService,
  IIdGenerator,
  ITimestampProvider,
} from '../interfaces';
import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types';
import { TodoStatus, TodoPriority } from '../types';

/**
 * Todo Repository Implementation
 * Implements Dependency Inversion Principle - depends on abstractions (interfaces)
 * Implements Single Responsibility Principle - handles todo business logic only
 */
export class TodoRepository implements ITodoRepository {
  constructor(
    private readonly storage: IStorageService,
    private readonly idGenerator: IIdGenerator,
    private readonly timestampProvider: ITimestampProvider,
  ) {}

  async getAll(): Promise<Todo[]> {
    return this.storage.getAll();
  }

  async getById(id: string): Promise<Todo | null> {
    return this.storage.getById(id);
  }

  async create(dto: CreateTodoDTO): Promise<Todo> {
    const now = this.timestampProvider.now();
    const todo: Todo = {
      id: this.idGenerator.generate(),
      title: dto.title.trim(),
      description: dto.description?.trim(),
      status: TodoStatus.PENDING,
      priority: dto.priority ?? TodoPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(todo);
  }

  async update(id: string, dto: UpdateTodoDTO): Promise<Todo | null> {
    const existing = await this.storage.getById(id);
    if (!existing) {
      return null;
    }

    const updatedTodo: Todo = {
      ...existing,
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.description !== undefined && {
        description: dto.description?.trim(),
      }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      updatedAt: this.timestampProvider.now(),
    };

    return this.storage.update(id, updatedTodo);
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }

  async clear(): Promise<void> {
    return this.storage.clear();
  }
}

/**
 * Factory function to create a Todo repository
 * Follows Factory Pattern and Dependency Injection
 */
export function createTodoRepository(
  storage: IStorageService,
  idGenerator: IIdGenerator,
  timestampProvider: ITimestampProvider,
): ITodoRepository {
  return new TodoRepository(storage, idGenerator, timestampProvider);
}
