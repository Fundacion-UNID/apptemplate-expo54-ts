// cypress/e2e/user-search.cy.js

describe('User Search End-to-End Flow', () => {
  it('should log in, search for a user, and see the result notification', () => {
    // --- Setup ---
    // Configura la URL base en cypress.config.js
    cy.visit('/'); // Visita la URL base

    // --- Login Flow ---
    // Cypress usa `data-testid` como selector preferido.
    // Necesitamos usar `cy.get()` y `click()`.
    cy.get('[data-testid=organization-button]').click();
    cy.screenshot('01_landing_screen');

    cy.contains('Login').click();
    cy.screenshot('02_login_screen');
    
    cy.get('[data-testid=email-input]').type('demo@user.com');
    cy.get('[data-testid=code-input]').type('111');
    
    // Cypress es más explícito sobre encontrar elementos por su texto.
    cy.contains('Continue').click();
    
    cy.contains('Professional Dashboard').should('be.visible');
    cy.screenshot('03_dashboard_screen');

    // --- Navigate to New Connection ---
    cy.contains('Communications').click();
    cy.screenshot('04_communications_screen');

    cy.get('[data-testid=add-connection-button]').click();
    cy.contains('New Connection').should('be.visible');
    cy.screenshot('05_new_connection_screen');

    // --- Perform the Search ---
    cy.contains('Email/Phone').click();
    cy.get('[data-testid=email-search-input]').type('test@example.com');
    
    cy.contains('Search User').click();
    
    cy.contains('Searching, please wait...').should('be.visible');
    cy.screenshot('06_search_pending');
    
    // --- Wait for Notification and Verify Result ---
    // Aumentamos el timeout para esta aserción específica
    cy.contains('Task Complete', { timeout: 10000 }).should('be.visible');
    cy.screenshot('07_notification_visible');

    cy.contains('View Results').click();
    
    cy.contains('Request Permissions').should('be.visible');
    cy.contains('Result Received').should('be.visible');
    cy.screenshot('08_permissions_screen');
  });
});