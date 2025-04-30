describe('Log Analyzer', () => {
  const mockSessionToken = 'mock-session-token';
  
  beforeEach(() => {
    // Mock Clerk authentication endpoints
    cy.intercept('POST', 'https://powerful-sloth-38.clerk.accounts.dev/v1/dev_browser*', {
      statusCode: 200,
      body: {
        id: 'test-dev-browser-id',
        session: mockSessionToken
      }
    }).as('getDevBrowser');

    cy.intercept('GET', 'https://powerful-sloth-38.clerk.accounts.dev/v1/client*', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        },
        session: mockSessionToken
      }
    }).as('getClient');

    cy.intercept('PATCH', 'https://powerful-sloth-38.clerk.accounts.dev/v1/environment*', (req) => {
      // Check if the request has the session token
      if (req.query.__dev_session === mockSessionToken) {
        req.reply({
          statusCode: 200,
          body: {
            success: true
          }
        });
      } else {
        req.reply({
          statusCode: 401,
          body: {
            error: 'Invalid session'
          }
        });
      }
    }).as('updateEnvironment');

    // Mock our internal auth endpoints
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: { 
        isAuthenticated: true,
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    }).as('getAuthState');

    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    }).as('getSession');
  });

  it('should show the log analyzer component for authenticated users', () => {
    cy.visit('/', { failOnStatusCode: false });
    
    // Wait for Clerk initialization
    cy.wait('@getDevBrowser');
    cy.wait('@getClient');
    cy.wait('@updateEnvironment');
    
    // Wait for our auth endpoints
    cy.wait('@getAuthState');
    cy.wait('@getSession');
    
    cy.get('[data-test="log-analyzer-title"]').should('be.visible');
    cy.get('[data-test="log-input"]').should('be.visible');
    cy.get('[data-test="analyze-button"]').should('be.visible');
  });

  it('should analyze logs successfully', () => {
    cy.visit('/', { failOnStatusCode: false });
    
    // Wait for Clerk initialization
    cy.wait('@getDevBrowser');
    cy.wait('@getClient');
    cy.wait('@updateEnvironment');
    
    // Wait for our auth endpoints
    cy.wait('@getAuthState');
    cy.wait('@getSession');
    
    // Mock the analysis API response
    cy.intercept('POST', '/api/analyze', {
      statusCode: 200,
      body: {
        analysis: 'Test analysis result',
        suggestions: ['Test suggestion 1', 'Test suggestion 2']
      }
    }).as('analyzeLogs');

    // Fill out the form
    cy.get('[data-test="log-input"]').type('Test log message');
    cy.get('[data-test="analyze-button"]').click();

    // Wait for the analysis to complete
    cy.wait('@analyzeLogs');
    
    // Check that the results are displayed
    cy.contains('Test analysis result').should('be.visible');
    cy.contains('Test suggestion 1').should('be.visible');
    cy.contains('Test suggestion 2').should('be.visible');
  });

  it('should handle invalid input', () => {
    cy.visit('/', { failOnStatusCode: false });
    
    // Wait for Clerk initialization
    cy.wait('@getDevBrowser');
    cy.wait('@getClient');
    cy.wait('@updateEnvironment');
    
    // Wait for our auth endpoints
    cy.wait('@getAuthState');
    cy.wait('@getSession');
    
    // Submit the form without entering any text
    cy.get('[data-test="analyze-button"]').click();
    
    // Check for error message
    cy.contains('Please enter a log message').should('be.visible');
  });
}); 