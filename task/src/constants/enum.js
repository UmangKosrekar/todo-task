exports.userEnum = Object.freeze({
  role: {
    ADMIN: "admin",
    USER: "user"
  }
});

exports.todoEnum = Object.freeze({
  status: {
    PENDING: "pending",
    COMPLETED: "completed"
  }
});

exports.errorCodes = Object.freeze({
  VALIDATION_ERROR: "VALIDATION_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED"
});
