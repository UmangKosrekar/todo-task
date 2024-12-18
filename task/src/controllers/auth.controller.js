const jwt = require("jsonwebtoken");
const { errorCodes } = require("../constants/enum");
const { responseHandler, CustomError } = require("../helper");
const { UserModel } = require("../model");

/**
 * @typedef {Object} RegisterRequestBody
 * @property {string} userName - Unique username of the user.
 * @property {string} password - Password of the user.
 * @property {string} [email] - Optional email address of the user.
 */

/**
 * @typedef {Object} LoginRequestBody
 * @property {string} userName - Username of the user.
 * @property {string} password - Password of the user.
 */

/**
 * Registers a new user.
 *
 * @route POST /api/v1/auth/register
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 * @throws {CustomError} If the username is already registered.
 */
exports.register = async (req, res, next) => {
  try {
    const { userName } = req.body;

    const duplicateUserName = await UserModel.countDocuments({
      userName
    }).lean();

    if (duplicateUserName) {
      throw new CustomError(
        "User Name is already Registered",
        errorCodes.BAD_REQUEST,
        400
      );
    }

    const getUser = await UserModel.create(req.body);

    return responseHandler(res, 201, "Registered!", { _id: getUser._id });
  } catch (error) {
    console.trace(error);
    next(error);
  }
};

/**
 * Login to existing user/admin
 *
 * @route POST /api/v1/auth/login
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @throws {CustomError}
 */
exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const userRecord = await UserModel.findOne({ userName });
    const ifCorrect = await userRecord?.validatePassword(password);

    if (!ifCorrect) {
      throw new CustomError("Invalid Credentials", errorCodes.BAD_REQUEST, 400);
    }

    const _token = jwt.sign({ _id: userRecord._id }, process.env.JWT_SECRET, {
      expiresIn: "12h"
    });

    return responseHandler(res, 200, "LoggedIn!", {
      token: _token
    });
  } catch (error) {
    console.trace(error);
    next(error);
  }
};
