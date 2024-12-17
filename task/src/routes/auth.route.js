const { Router } = require("express");
const app = Router();
const { register, login } = require("../controllers");
const { joiValidator } = require("../helper");
const { registerValidation, loginValidation } = require("../helper/validation");

app.post("/register", joiValidator(registerValidation), register);
app.post("/login", joiValidator(loginValidation), login);

module.exports = app;
