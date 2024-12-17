const joi = require("joi");
const { todoEnum } = require("../../constants/enum");

exports.createTodoValidation = joi
  .object({
    title: joi.string().required(),
    description: joi.string().email(),
    userId: joi.string().required()
  })
  .required();

exports.updateTodoValidation = joi
  .object({
    status: joi
      .string()
      .required()
      .valid(...Object.values(todoEnum.status))
  })
  .required();
