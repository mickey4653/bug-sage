// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Mock Clerk
Cypress.Commands.add('mockClerk', () => {
  cy.window().then((win) => {
    win.Clerk = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      isSignedIn: true,
      isLoaded: true,
    };
  });
});

// Type definitions for custom commands
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      mockClerk(): void;
    }
  }

  interface Window {
    Clerk: {
      user: {
        id: string;
        email: string;
      };
      isSignedIn: boolean;
      isLoaded: boolean;
    };
  }
}
