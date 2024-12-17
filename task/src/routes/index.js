const { Router } = require("express");
const app = Router();

app.use("/auth", require("./auth.route"));
app.use("/todo", require("./todo.route"));

module.exports = app;
