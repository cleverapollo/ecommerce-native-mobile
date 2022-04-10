describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.get('ion-app').should('have.length', 1);
  })
})
