require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();
const swaggerSpecs = require("./swagger");

// Middlewares
app.use(require("./helper").rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logger
app.use(require("morgan")("dev"));
app.use(require("cors")());

// Routes and Error Handler
app.use("/api/v1", require("./routes"));
app.use(require("./helper/handles").errorHandler);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(process.env.PORT, () => {
  require("./db");
  console.log(`Server @ ${process.env.PORT}`);
});
