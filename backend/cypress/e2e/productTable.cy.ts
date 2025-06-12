describe('Product Table Page-Filter', () => {
  beforeEach(() => {
    cy.intercept('GET', /\/products.*/, {
      statusCode: 200,
      body: [
        {
          _id: '1',
          name: 'Mock Product',
          description: 'This is a test product',
          price: 199,
          stock: 50,
          createdAt: new Date().toISOString(),
          images: ['sample.jpg'],
        },
         {
          _id: '2',
          name: 'Filtered Product',
          description: 'Filtered product desc',
          price: 500,
          stock: 20,
          createdAt: new Date().toISOString(),
          images: [],
        },
      ],
    }).as('filteredProducts');

    cy.visit('http://localhost:3001/table');
    // cy.wait('@fetchProducts');
  });

  it('renders the product table with mocked data', () => {
    cy.contains('Product Table').should('exist');
    cy.contains('Mock Product').should('exist');
    cy.contains('₹199').should('exist');
  });

  it('filters products by name', () => {
    // Set filter input (use label-to-id association)
    cy.contains('label', 'Filter by')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get(`#${id}`).clear().type('Filtered Product');
      });

    // Click Apply Filters button (this triggers the request)
    cy.contains('button', 'Apply Filters').click();

    // Wait for intercepted request
    cy.wait('@filteredProducts');

    // Check that filtered product appears
    cy.contains('Filtered Product').should('exist');
    cy.contains('₹500').should('exist');
  });
});
