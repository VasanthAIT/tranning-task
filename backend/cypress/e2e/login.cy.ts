describe('Login Page', () => {
  beforeEach(() => {
   
    cy.visit('/login');
  });

  it('should render login form correctly', () => {
    cy.contains('Login');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'LOGIN');
  });

  

  

  it('should login successfully with correct credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token' },
    }).as('loginSuccess');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.url().should('include', '/table');
  });

  it('should display error message on login failure', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginFail');

    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');

    cy.contains('Invalid credentials').should('exist');
  });

  it('should toggle password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.get('button').find('svg').click(); 
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
  });

  it('should navigate to register page', () => {
    cy.contains('Register here').click();
    cy.url().should('include', '/register');
  });
});