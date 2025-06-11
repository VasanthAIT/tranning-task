describe("Product Table", () => {
  const mockProducts = [
    {
      _id: "1",
      name: "Apple",
      description: "Fresh Apple",
      price: 100,
      stock: 10,
      createdAt: new Date().toISOString(),
      images: ["apple.jpg"],
    },
    {
      _id: "2",
      name: "Banana",
      description: "Yellow Banana",
      price: 60,
      stock: 30,
      createdAt: new Date().toISOString(),
      images: ["banana.jpg"],
    },
  ];

  beforeEach(() => {
    cy.intercept("GET", "**/products*", {
      statusCode: 200,
      body: mockProducts,
    }).as("fetchProducts");

    cy.visit("/table");
    cy.wait("@fetchProducts", { timeout: 500 });

    cy.get("table").should("exist");
  });

 
  it("navigates to Add Product page", () => {
    cy.get("button").contains("Add Product").click();
    cy.url().should("include", "/add");
  });

  it("navigates to Product List page", () => {
    cy.get("button").contains("Product List").click();
    cy.url().should("include", "/list");
  });

  it("navigates to Edit Product page", () => {
    cy.get("button").contains("Add Product").click(); // To confirm routing works
    cy.visit("/table");
    cy.wait("@fetchProducts");
    cy.get("table tbody tr").first().within(() => {
      cy.get("button").eq(0).click();
    });
    cy.url().should("include", "/edit/1");
  });

  it("deletes a product successfully", () => {
    cy.window().then((win) => cy.stub(win, "confirm").returns(true));

    cy.intercept("DELETE", "**/products/1", {
      statusCode: 200,
    }).as("deleteProduct");

    cy.get("table tbody tr").first().within(() => {
      cy.get("button").eq(1).click(); // Delete button
    });

    cy.wait("@deleteProduct");
    cy.wait("@fetchProducts");
  });

  it("shows alert if delete fails", () => {
    cy.window().then((win) => cy.stub(win, "confirm").returns(true));

    cy.intercept("DELETE", "**/products/1", {
      statusCode: 500,
      body: { message: "Delete failed" },
    }).as("deleteProductFail");

    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    cy.get("table tbody tr").first().within(() => {
      cy.get("button").eq(1).click(); 
    });

    cy.wait("@deleteProductFail").then(() => {
      expect(alertStub).to.have.been.calledWithMatch("Delete failed");
    });
  });
});
