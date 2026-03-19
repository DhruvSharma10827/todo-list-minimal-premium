/**
 * Todo List Minimal Premium App
 * A minimal, premium todo list application
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TodoProvider } from './src/context';
import { TodoListScreen } from './src/components';
import { initializeTodoRepository } from './src/services';

// Initialize the repository on app start
const repository = initializeTodoRepository();

// Custom theme for premium look
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2D7DD2',
    primaryContainer: '#CFE4FC',
    secondary: '#97CC04',
    secondaryContainer: '#E8F5E9',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#E63946',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#001D3D',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1B5E20',
    onSurface: '#1A1A1A',
    onSurfaceVariant: '#666666',
    onBackground: '#1A1A1A',
    onError: '#FFFFFF',
    outline: '#CCCCCC',
    outlineVariant: '#E0E0E0',
  },
};

function App(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />
        <TodoProvider repository={repository}>
          <TodoListScreen />
        </TodoProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
