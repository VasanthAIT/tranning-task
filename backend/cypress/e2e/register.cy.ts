/// <reference types="cypress" />

describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the registration form", () => {
    cy.get("h4").contains("Register");
    cy.get('input[name="username"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get("button").contains("REGISTER");
  });

  it("should show alert if fields are empty", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get("button").contains("REGISTER").click().then(() => {
      expect(stub.getCall(0)).to.be.calledWith("All fields are required.");
    });
  });

  it("should fill the form and submit it", () => {
    cy.intercept("POST", "/auth/register", {
      statusCode: 201,
      body: { message: "Registered successfully" },
    }).as("registerUser");

    const stub = cy.stub();
    cy.on("window:alert", stub);

    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('input[name="password"]').type("password123");

    cy.get("button").contains("REGISTER").click();

    cy.wait("@registerUser").then(() => {
      expect(stub.getCall(0)).to.be.calledWith("Registered successfully! You can now login.");
      cy.url().should("include", "/login");
    });
  });
});
