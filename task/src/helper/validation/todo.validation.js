const joi = require("joi");
const { todoEnum } = require("../../constants/enum");

exports.createTodoValidation = joi
  .object({
    title: joi.string().required(),
    description: joi.string().allow(""),
    userId: joi.string().required()
  })
  .required();
