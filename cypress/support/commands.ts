// ***********************************************
// This example shows how to create custom commands
// and extend existing commands in Cypress.
//
// For more information, see:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom selector helpers
Cypress.Commands.add('getBySel', (selector: string, ...args) => {
  return cy.get(`[data-test="${selector}"]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector: string, ...args) => {
  return cy.get(`[data-test*="${selector}"]`, ...args)
})

// Type definitions
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Cypress {
  interface Chainable {
    getBySel(selector: string): Chainable<JQuery<HTMLElement>>
    getBySelLike(selector: string): Chainable<JQuery<HTMLElement>>
  }
} 