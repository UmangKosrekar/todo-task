const { Router } = require("express");
const app = Router();
const {
  createTodo,
  listTodo,
  updateTodo,
  deleteTodo
} = require("../controllers");
const { joiValidator } = require("../helper");
const {
  createTodoValidation,
  updateTodoValidation
} = require("../helper/validation");
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
app.patch(
  "/:id",
  joiValidator(updateTodoValidation),
  authMiddleware([userEnum.role.USER]),
  updateTodo
);
app.delete("/:id", authMiddleware([userEnum.role.ADMIN]), deleteTodo);

module.exports = app;
