const joi = require("joi");
const { userEnum } = require("../../constants/enum");

const registerValidation = joi
  .object({
    userName: joi.string().required(),
    password: joi.string().required(),
    role: joi.string().valid(...Object.values(userEnum.role))
  })
  .required();

const loginValidation = joi
  .object({
    userName: joi.string().required(),
    password: joi.string().required()
  })
  .required();

module.exports = { registerValidation, loginValidation };
