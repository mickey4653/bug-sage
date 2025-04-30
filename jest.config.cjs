/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  globals: {
    'process.env': {
      NEXT_PUBLIC_SUPABASE_URL: 'https://mock-supabase-url.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'mock-clerk-key',
      CLERK_SECRET_KEY: 'mock-clerk-secret',
    },
  },
};

module.exports = config; 