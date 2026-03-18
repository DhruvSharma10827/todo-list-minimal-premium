module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-safe-area-context|react-native-vector-icons|react-native-mmkv|react-native-gesture-handler)/)',
  ],
  moduleNameMapper: {
    '^@todo-list/core$': '<rootDir>/../../packages/core/src',
    '^@todo-list/storage$': '<rootDir>/../../packages/storage/src',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
