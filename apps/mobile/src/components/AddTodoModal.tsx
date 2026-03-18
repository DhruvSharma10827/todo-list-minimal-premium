import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Modal,
  Portal,
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import type {
  Todo,
  CreateTodoDTO,
  UpdateTodoDTO,
} from '../context/TodoContext';
import { TodoPriority } from '../context/TodoContext';

/**
 * AddTodoModal Props
 */
interface AddTodoModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (dto: CreateTodoDTO | UpdateTodoDTO) => void;
  todo?: Todo | null;
}

/**
 * AddTodoModal Component
 * Modal for adding or editing a todo
 */
export function AddTodoModal({
  visible,
  onDismiss,
  onSave,
  todo,
}: AddTodoModalProps): React.ReactElement {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);

  const isEditing = !!todo;

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
    } else {
      setTitle('');
      setDescription('');
      setPriority(TodoPriority.MEDIUM);
    }
  }, [todo, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const dto: CreateTodoDTO | UpdateTodoDTO = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    };

    onSave(dto);
    onDismiss();
  };

  const handleDismiss = () => {
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          autoFocus
        />
        <TextInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <View style={styles.priorityContainer}>
          <SegmentedButtons
            value={priority}
            onValueChange={value => setPriority(value as TodoPriority)}
            buttons={[
              {
                value: TodoPriority.LOW,
                label: 'Low',
                icon: 'flag-outline',
                style: [
                  styles.segmentButton,
                  priority === TodoPriority.LOW && styles.lowPriority,
                ],
              },
              {
                value: TodoPriority.MEDIUM,
                label: 'Medium',
                icon: 'flag',
                style: [
                  styles.segmentButton,
                  priority === TodoPriority.MEDIUM && styles.mediumPriority,
                ],
              },
              {
                value: TodoPriority.HIGH,
                label: 'High',
                icon: 'flag-variant',
                style: [
                  styles.segmentButton,
                  priority === TodoPriority.HIGH && styles.highPriority,
                ],
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleDismiss} style={styles.button}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            disabled={!title.trim()}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  input: {
    marginBottom: 16,
  },
  priorityContainer: {
    marginBottom: 20,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  segmentButton: {
    borderRadius: 8,
  },
  lowPriority: {
    backgroundColor: '#E8F5E9',
  },
  mediumPriority: {
    backgroundColor: '#FFF3E0',
  },
  highPriority: {
    backgroundColor: '#FFEBEE',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
});
