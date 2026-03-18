/**
 * Todo Status Enum
 * Represents the possible states of a todo item
 */
export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

/**
 * Todo Priority Enum
 * Represents the priority level of a todo item
 */
export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Todo Entity
 * Represents a single todo item in the application
 */
export interface Todo {
  /** Unique identifier for the todo */
  id: string;
  /** Title/text content of the todo */
  title: string;
  /** Optional description for additional details */
  description?: string;
  /** Current status of the todo */
  status: TodoStatus;
  /** Priority level of the todo */
  priority: TodoPriority;
  /** Creation timestamp (ISO string) */
  createdAt: string;
  /** Last update timestamp (ISO string) */
  updatedAt: string;
}

/**
 * Create Todo DTO
 * Data transfer object for creating a new todo
 */
export interface CreateTodoDTO {
  title: string;
  description?: string;
  priority?: TodoPriority;
}

/**
 * Update Todo DTO
 * Data transfer object for updating an existing todo
 */
export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
}
