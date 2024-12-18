const { Router } = require("express");
const app = Router();
const {
  createTodo,
  listTodo,
  updateTodo,
  deleteTodo,
  userList
} = require("../controllers");
const { joiValidator } = require("../helper");
const { createTodoValidation } = require("../helper/validation");
const { userEnum } = require("../constants/enum");
const { authMiddleware } = require("../middleware/auth.middleware");

app.post(
  "/",
  authMiddleware([userEnum.role.ADMIN]),
  joiValidator(createTodoValidation),
  createTodo
);
app.get(
  "/",
  authMiddleware([userEnum.role.ADMIN, userEnum.role.USER]),
  listTodo
);
app.patch("/:id", authMiddleware([userEnum.role.USER]), updateTodo);
app.delete("/:id", authMiddleware([userEnum.role.ADMIN]), deleteTodo);

app.get("/user-list", authMiddleware([userEnum.role.ADMIN]), userList);

module.exports = app;
