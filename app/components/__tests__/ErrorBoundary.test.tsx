import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Create a component that throws an error when a prop is true
const ErrorComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error occurred</div>;
};

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
  
  it('renders error UI when error is thrown', () => {
    // Using ErrorBoundary with a component that throws
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    
    // Initial render should show no error
    expect(screen.getByText('No error occurred')).toBeInTheDocument();
    
    // Suppress error boundary warning in test
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Rerender with error-throwing component
    rerender(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Error UI should be shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    
    errorSpy.mockRestore();
  });
  
  it('resets error state when "Try again" button is clicked', () => {
    // Create a variable to control error state
    let shouldThrow = true;
    
    // Create a component that throws conditionally based on our variable
    const ToggleErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error message');
      }
      return <div>Error resolved</div>;
    };
    
    // Suppress error boundary warning in test
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ToggleErrorComponent />
      </ErrorBoundary>
    );
    
    // Error UI should be shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Change the variable so component won't throw on re-render
    shouldThrow = false;
    
    // Click the try again button
    fireEvent.click(screen.getByText('Try again'));
    
    // Component should render without error now
    expect(screen.getByText('Error resolved')).toBeInTheDocument();
    
    errorSpy.mockRestore();
  });
  
  it('correctly passes error info to componentDidCatch', () => {
    // Create a spy on componentDidCatch
    const componentDidCatchSpy = jest.spyOn(
      ErrorBoundary.prototype, 
      'componentDidCatch'
    );
    
    // Suppress error boundary warning in test
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Check if componentDidCatch was called
    expect(componentDidCatchSpy).toHaveBeenCalled();
    expect(componentDidCatchSpy.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(componentDidCatchSpy.mock.calls[0][0].message).toBe('Test error message');
    
    componentDidCatchSpy.mockRestore();
    errorSpy.mockRestore();
  });
}); 