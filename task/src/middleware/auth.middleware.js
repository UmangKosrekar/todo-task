const jwt = require("jsonwebtoken");
const { errorCodes } = require("../constants/enum");
const { CustomError } = require("../helper");
const { UserModel } = require("../model/user.model");

exports.authMiddleware = (role) => async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const findUser = await UserModel.findOne({ _id: decoded?._id }).lean();
      if (role.includes(findUser?.role)) {
        req.user = findUser;
        next();
        return;
      }
    }

    throw new CustomError("UNAUTHORIZED", errorCodes.UNAUTHORIZED, 401);
  } catch (error) {
    next(error);
  }
};
