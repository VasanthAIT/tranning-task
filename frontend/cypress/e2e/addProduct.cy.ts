describe('Add Product Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/products/add');
  });

  it('renders the form fields correctly', () => {
    cy.get('[data-testid="name"]').should('exist');
    cy.get('[data-testid="price"]').should('exist');
    cy.get('[data-testid="stock"]').should('exist');
    cy.get('[data-testid="images"]').should('exist');
  });

  it('shows validation error if fields are empty and form is submitted', () => {
    cy.get('[data-testid="form"]').submit();
    cy.contains('Name is required').should('exist');
    cy.contains('Price is required').should('exist');
  });
  });
   