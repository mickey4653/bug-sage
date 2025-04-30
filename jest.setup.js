// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { configure } from '@testing-library/react';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'mock-clerk-key';
process.env.CLERK_SECRET_KEY = 'mock-clerk-secret';

// Mock TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
    isLoaded: true,
    isSignedIn: true,
  }),
  useAuth: () => ({
    getToken: () => Promise.resolve('mock-token'),
  }),
  SignedIn: ({ children }) => <>{children}</>,
  SignedOut: ({ children }) => <>{children}</>,
  UserButton: () => <div>UserButton</div>,
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              offset: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
        }),
      }),
      delete: () => Promise.resolve({ error: null }),
      update: () => Promise.resolve({ error: null }),
    }),
  }),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Configure testing library
configure({
  asyncUtilTimeout: 5000,
  testIdAttribute: 'data-testid',
});

// Mock window.URL.createObjectURL
global.URL.createObjectURL = jest.fn();

// Suppress console errors during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update to') ||
      args[0].includes('Warning: The current testing environment') ||
      args[0].includes('Error: Not implemented: navigation'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Suppress React act warnings
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning: ReactDOM.render is no longer supported in React 18./.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 