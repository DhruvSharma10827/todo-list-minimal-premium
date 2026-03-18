import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Appbar, useTheme, Chip } from 'react-native-paper';
import { TodoItem } from './TodoItem';
import { AddTodoModal } from './AddTodoModal';
import { useTodos } from '../context/TodoContext';
import type {
  Todo,
  CreateTodoDTO,
  UpdateTodoDTO,
} from '../context/TodoContext';
import { TodoStatus } from '../context/TodoContext';

/**
 * Filter type for todos
 */
type FilterType = 'all' | 'pending' | 'completed';

/**
 * TodoListScreen Component
 * Main screen displaying the list of todos
 */
export function TodoListScreen(): React.ReactElement {
  const theme = useTheme();
  const {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    refreshTodos,
  } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'pending':
        return todos.filter(t => t.status === TodoStatus.PENDING);
      case 'completed':
        return todos.filter(t => t.status === TodoStatus.COMPLETED);
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedCount = useMemo(
    () => todos.filter(t => t.status === TodoStatus.COMPLETED).length,
    [todos],
  );

  const handleAddTodo = useCallback(
    async (dto: CreateTodoDTO | UpdateTodoDTO) => {
      if (selectedTodo) {
        await updateTodo(selectedTodo.id, dto);
      } else {
        await addTodo(dto as CreateTodoDTO);
      }
      setSelectedTodo(null);
    },
    [selectedTodo, addTodo, updateTodo],
  );

  const handleTodoPress = useCallback((todo: Todo) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  }, []);

  const handleDeleteTodo = useCallback(
    async (id: string) => {
      await deleteTodo(id);
    },
    [deleteTodo],
  );

  const handleToggleComplete = useCallback(
    async (id: string) => {
      await toggleComplete(id);
    },
    [toggleComplete],
  );

  const handleModalDismiss = useCallback(() => {
    setModalVisible(false);
    setSelectedTodo(null);
  }, []);

  const renderTodo = useCallback(
    ({ item }: { item: Todo }) => (
      <TodoItem
        todo={item}
        onToggle={handleToggleComplete}
        onDelete={handleDeleteTodo}
        onPress={handleTodoPress}
      />
    ),
    [handleToggleComplete, handleDeleteTodo, handleTodoPress],
  );

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Content
          title="Todo List"
          subtitle={`${completedCount} of ${todos.length} completed`}
        />
      </Appbar.Header>

      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        >
          All ({todos.length})
        </Chip>
        <Chip
          selected={filter === 'pending'}
          onPress={() => setFilter('pending')}
          style={styles.filterChip}
        >
          Pending ({todos.filter(t => t.status === TodoStatus.PENDING).length})
        </Chip>
        <Chip
          selected={filter === 'completed'}
          onPress={() => setFilter('completed')}
          style={styles.filterChip}
        >
          Completed ({completedCount})
        </Chip>
      </View>

      {todos.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyText}>
            No todos yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Tap the + button to add your first todo
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          renderItem={renderTodo}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refreshTodos} />
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
        color="white"
      />

      <AddTodoModal
        visible={modalVisible}
        onDismiss={handleModalDismiss}
        onSave={handleAddTodo}
        todo={selectedTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    marginRight: 4,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginBottom: 8,
    opacity: 0.7,
  },
  emptySubtext: {
    opacity: 0.5,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
