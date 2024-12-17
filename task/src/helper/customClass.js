class CustomError extends Error {
  /**
   * @param {string} message
   * @param {string} errorCode
   * @param {number=} statusCode
   */
  constructor(message, errorCode, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

module.exports = { CustomError };
