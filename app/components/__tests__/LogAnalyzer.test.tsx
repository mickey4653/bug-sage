import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogAnalyzer from '../LogAnalyzer';
import * as clerkHooks from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';

// Mock supabase functions
jest.mock('../../lib/supabase', () => ({
  saveAnalysis: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('LogAnalyzer', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Mock fetch to return successful response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ analysis: 'Test analysis result' }),
    });
    
    // Create a properly typed mock user
    const mockUser = {
      id: 'test-user',
      fullName: 'Test User',
    } as unknown as UserResource;
    
    // Mock clerk hooks
    jest.spyOn(clerkHooks, 'useUser').mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser
    });
    
    // Using a type assertion to handle complex mock structure
    jest.spyOn(clerkHooks, 'useAuth').mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: 'test-user-id',
      sessionId: 'test-session-id',
      orgId: null,
      orgRole: null,
      orgSlug: null,
      actor: null,
      getToken: jest.fn().mockImplementation(async () => {
        // Simulate token error to use localStorage fallback
        if (process.env.NODE_ENV === 'test') {
          throw new Error('Token error for testing');
        }
        return 'test-token';
      }),
      signOut: jest.fn(),
      has: jest.fn()
    } as unknown as ReturnType<typeof clerkHooks.useAuth>);
    
    // Setup process.env for tests
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: 'development' },
      writable: true
    });
  });

  it('renders the component', () => {
    render(<LogAnalyzer />);
    expect(screen.getByText('Log Analyzer')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<LogAnalyzer />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/logs/i), {
      target: { value: 'Test log message' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Analyze Logs'));
    
    // Wait for loading state
    await waitFor(() => {
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    });
    
    // Wait for analysis to complete
    await waitFor(() => {
      expect(screen.getByText('Test analysis result')).toBeInTheDocument();
    });
    
    // Verify localStorage was updated
    expect(localStorage.getItem('analysisHistory')).not.toBeNull();
  });

  it('tests platform selection dropdown', async () => {
    render(<LogAnalyzer />);
    
    // Select platform from dropdown
    const platformSelect = screen.getByLabelText('Select platform');
    fireEvent.change(platformSelect, { target: { value: 'aws' } });
    
    // Check select has the expected value
    expect(platformSelect).toHaveValue('aws');
  });

  it('tests frontend context selection', async () => {
    render(<LogAnalyzer />);
    
    // Get frontend select and change its value
    const frontendSelect = screen.getByLabelText('Select frontend framework');
    fireEvent.change(frontendSelect, { target: { value: 'react' } });
    
    // Check select has the expected value
    expect(frontendSelect).toHaveValue('react');
  });

  it('tests backend context selection', async () => {
    render(<LogAnalyzer />);
    
    // Get backend select and change its value
    const backendSelect = screen.getByLabelText('Select backend technology');
    fireEvent.change(backendSelect, { target: { value: 'nodejs' } });
    
    // Check select has the expected value
    expect(backendSelect).toHaveValue('nodejs');
  });

  it('tests analysis results display', async () => {
    render(<LogAnalyzer />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/logs/i), {
      target: { value: 'Test log message' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Analyze Logs'));
    
    // Wait for analysis to complete
    await waitFor(() => {
      expect(screen.getByText('Test analysis result')).toBeInTheDocument();
    });
    
    // Verify analysis display and buttons
    expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    expect(screen.getByText('New Analysis')).toBeInTheDocument();
    expect(screen.getByText('Re-analyze')).toBeInTheDocument();
  });
}); 