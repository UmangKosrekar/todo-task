const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List",
      version: "1.0.0",
      description: `
Welcome to the Documentation!\n
Refer this API Documentation.
`,
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    tags: [{ name: "APIs", description: "" }]
  },
  apis: [
    path.resolve(__dirname, "./auth.yaml"),
    path.resolve(__dirname, "./todo.yaml")
  ]
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;
