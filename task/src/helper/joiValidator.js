const { errorCodes } = require("../constants/enum");
const { CustomError } = require("./customClass");

exports.joiValidator = (Schema) => {
  try {
    return (req, res, next) => {
      const { error } = Schema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message.replace(/["]/g, "");
        throw new CustomError(errorMessage, errorCodes.VALIDATION_ERROR, 422);
      }
      next();
    };
  } catch (error) {
    next(error);
  }
};
