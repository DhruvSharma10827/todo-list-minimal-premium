import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, IconButton, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import type { Todo } from '../context/TodoContext';
import { TodoStatus, TodoPriority } from '../context/TodoContext';

/**
 * TodoItem Props
 */
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (todo: Todo) => void;
}

/**
 * Get priority color based on priority level
 */
function getPriorityColor(priority: TodoPriority, theme: MD3Theme): string {
  switch (priority) {
    case TodoPriority.HIGH:
      return theme.colors.error;
    case TodoPriority.MEDIUM:
      return '#FFA500';
    case TodoPriority.LOW:
      return '#4CAF50';
    default:
      return theme.colors.outline;
  }
}

/**
 * TodoItem Component
 * Displays a single todo item with actions
 */
export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onPress,
}: TodoItemProps): React.ReactElement {
  const theme = useTheme();
  const isCompleted = todo.status === TodoStatus.COMPLETED;
  const priorityColor = getPriorityColor(todo.priority, theme);

  return (
    <List.Item
      title={todo.title}
      description={todo.description}
      descriptionNumberOfLines={1}
      left={() => (
        <View style={styles.leftContainer}>
          <IconButton
            icon={
              isCompleted
                ? 'checkbox-marked-circle'
                : 'checkbox-blank-circle-outline'
            }
            iconColor={
              isCompleted ? theme.colors.primary : theme.colors.outline
            }
            size={24}
            onPress={() => onToggle(todo.id)}
          />
          <View
            style={[
              styles.priorityIndicator,
              { backgroundColor: priorityColor },
            ]}
          />
        </View>
      )}
      right={() => (
        <IconButton
          icon="delete-outline"
          iconColor={theme.colors.outline}
          size={20}
          onPress={() => onDelete(todo.id)}
        />
      )}
      onPress={() => onPress(todo)}
      titleStyle={[isCompleted && styles.completedTitle]}
      style={[styles.container, isCompleted && styles.completedContainer]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedContainer: {
    opacity: 0.7,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
});
