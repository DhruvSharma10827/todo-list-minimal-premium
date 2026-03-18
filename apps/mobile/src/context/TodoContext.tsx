import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {
  Todo,
  CreateTodoDTO,
  UpdateTodoDTO,
  ITodoRepository,
} from '@todo-list/core';
import { TodoStatus, TodoPriority } from '@todo-list/core';

// Re-export types for components
export type { Todo, CreateTodoDTO, UpdateTodoDTO } from '@todo-list/core';
export { TodoStatus, TodoPriority };

/**
 * Todo Context State Interface
 */
interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Todo Context Actions Interface
 */
interface TodoActions {
  addTodo: (dto: CreateTodoDTO) => Promise<void>;
  updateTodo: (id: string, dto: UpdateTodoDTO) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  refreshTodos: () => Promise<void>;
}

/**
 * Todo Context Type
 */
interface TodoContextType extends TodoState, TodoActions {}

/**
 * Todo Context
 */
const TodoContext = createContext<TodoContextType | undefined>(undefined);

/**
 * Todo Provider Props
 */
interface TodoProviderProps {
  repository: ITodoRepository;
  children: React.ReactNode;
}

/**
 * Todo Provider Component
 * Manages todo state and provides actions to child components
 */
export function TodoProvider({
  repository,
  children,
}: TodoProviderProps): React.ReactElement {
  const [state, setState] = useState<TodoState>({
    todos: [],
    isLoading: true,
    error: null,
  });

  const refreshTodos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const todos = await repository.getAll();
      setState(prev => ({ ...prev, todos, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load todos',
      }));
    }
  }, [repository]);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  const addTodo = useCallback(
    async (dto: CreateTodoDTO) => {
      try {
        setState(prev => ({ ...prev, error: null }));
        await repository.create(dto);
        await refreshTodos();
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to add todo',
        }));
      }
    },
    [repository, refreshTodos],
  );

  const updateTodo = useCallback(
    async (id: string, dto: UpdateTodoDTO) => {
      try {
        setState(prev => ({ ...prev, error: null }));
        await repository.update(id, dto);
        await refreshTodos();
      } catch (error) {
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error ? error.message : 'Failed to update todo',
        }));
      }
    },
    [repository, refreshTodos],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        setState(prev => ({ ...prev, error: null }));
        await repository.delete(id);
        await refreshTodos();
      } catch (error) {
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error ? error.message : 'Failed to delete todo',
        }));
      }
    },
    [repository, refreshTodos],
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      const todo = state.todos.find(t => t.id === id);
      if (!todo) {
        return;
      }
      const newStatus =
        todo.status === TodoStatus.COMPLETED
          ? TodoStatus.PENDING
          : TodoStatus.COMPLETED;
      await updateTodo(id, { status: newStatus });
    },
    [state.todos, updateTodo],
  );

  const clearCompleted = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const completedTodos = state.todos.filter(
        t => t.status === TodoStatus.COMPLETED,
      );
      await Promise.all(completedTodos.map(t => repository.delete(t.id)));
      await refreshTodos();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to clear completed todos',
      }));
    }
  }, [state.todos, repository, refreshTodos]);

  const value = useMemo<TodoContextType>(
    () => ({
      ...state,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleComplete,
      clearCompleted,
      refreshTodos,
    }),
    [
      state,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleComplete,
      clearCompleted,
      refreshTodos,
    ],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

/**
 * Custom hook to use Todo Context
 */
export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
