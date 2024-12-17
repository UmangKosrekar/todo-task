const responseHandler = (res, statusCode, message, data, errorCode) => {
  return res.status(statusCode).json({
    status: statusCode > 299 ? false : true,
    message,
    data,
    errorCode
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return responseHandler(res, statusCode, message, null, err.errorCode);
};

module.exports = {
  responseHandler,
  errorHandler
};
