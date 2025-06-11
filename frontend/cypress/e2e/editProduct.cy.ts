describe('Edit Product Page', () => {
  const mockProduct = {
    _id: '123456',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 50,
  };

  beforeEach(() => {
    cy.intercept('GET', `**/products/${mockProduct._id}`, {
      statusCode: 200,
      body: mockProduct,
    }).as('getProduct');

    cy.visit(`/edit/${mockProduct._id}`);
    cy.wait('@getProduct');
  });

  it('renders the product form with fetched data', () => {
    cy.get('input[name="name"]').should('have.value', mockProduct.name);
    cy.get('input[name="description"]').should(
      'have.value',
      mockProduct.description
    );
    cy.get('input[name="price"]').should('have.value', mockProduct.price);
    cy.get('input[name="stock"]').should('have.value', mockProduct.stock);
    cy.get('input[type="file"]').should('exist');
    cy.get('button').contains('Submit');
  });

  it('updates product successfully', () => {
    // Change fields
    cy.get('input[name="name"]').clear().type('Updated Product');
    cy.get('input[name="description"]').clear().type('Updated Description');
    cy.get('input[name="price"]').clear().type('150');
    cy.get('input[name="stock"]').clear().type('60');

    // Upload image
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.jpg', {
      force: true,
    });

    // Intercept PUT request
    cy.intercept('PUT', `**/products/${mockProduct._id}`, {
      statusCode: 200,
      body: { message: 'Product updated successfully' },
    }).as('updateProduct');

    // Submit form
    cy.get('button').contains('Submit').click();

    // Verify PUT was called
    cy.wait('@updateProduct').its('response.statusCode').should('eq', 200);

    // Verify alert
    cy.on('window:alert', (text) => {
      expect(text).to.include('Product updated successfully');
    });
  });

  it('shows error alert if update fails', () => {
    cy.intercept('PUT', `**/products/${mockProduct._id}`, {
      statusCode: 500,
      body: { message: 'Failed to update product' },
    }).as('updateProductError');

    // Try to submit unchanged data
    cy.get('button').contains('Submit').click();

    cy.wait('@updateProductError');

    cy.on('window:alert', (text) => {
      expect(text).to.include('Failed to update product');
    });
  });
});
