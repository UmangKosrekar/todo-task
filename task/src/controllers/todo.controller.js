const { errorCodes, userEnum, todoEnum } = require("../constants/enum");
const { responseHandler, CustomError } = require("../helper");
const { TodoModel, UserModel } = require("../model");

/**
 * Create New Todo
 *
 * @route POST /api/v1/todo
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @throws {CustomError}
 */
exports.createTodo = async (req, res, next) => {
  try {
    const { title, userId } = req.body;

    const titleAlreadyUsed = await TodoModel.countDocuments({ title }).lean();

    if (titleAlreadyUsed) {
      throw new CustomError("Select Unique Title", errorCodes.BAD_REQUEST, 400);
    }
    const checkUser = await UserModel.findOne({ _id: userId }).lean();
    console.log("checkUser", checkUser);
    if (!checkUser || checkUser.role === userEnum.role.USER) {
      throw new CustomError(
        "Please Select Valid User",
        errorCodes.BAD_REQUEST,
        400
      );
    }

    const createdTask = await TodoModel.create(req.body);

    return responseHandler(res, 201, "Todo Added!", { _id: createdTask._id });
  } catch (error) {
    console.trace(error);
    next(error);
  }
};

/**
 * Paginated list of Todo
 *
 * @route GET /api/v1/todo
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @throws {CustomError}
 */
exports.listTodo = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 25,
      key = "_id",
      desc = false,
      search,
      statusFilter
    } = req.query;

    const paginationQuery = [
      { $sort: { [key]: desc === "true" ? -1 : 1 } },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    ];

    const condition = {};
    if (search) {
      condition.$text = { $search: search };
    }

    if (statusFilter) {
      condition.status = statusFilter;
    }

    const list = (
      await TodoModel.aggregate([
        { $match: condition },
        {
          $facet: {
            totalDocs: [{ $count: "totalDocs" }],
            result: [
              ...paginationQuery,
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userData"
                }
              },
              {
                $project: {
                  title: 1,
                  description: 1,
                  status: 1,
                  userName: { $first: "$userData.userName" }
                }
              }
            ]
          }
        }
      ])
    )[0];

    return responseHandler(res, 200, undefined, {
      totalDocs: list?.totalDocs[0]?.totalDocs ?? 0,
      result: list?.result ?? []
    });
  } catch (error) {
    console.trace(error);
    next(error);
  }
};

/**
 * Update Status
 *
 * @route PATCH /api/v1/todo/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @throws {CustomError}
 */
exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = await TodoModel.updateOne(
      { _id: id, userId: req.user._id },
      {
        $set: { status: todoEnum.status.COMPLETED }
      }
    );

    if (!updatedData.matchedCount) {
      throw new CustomError("Todo Not Found", errorCodes.BAD_REQUEST, 400);
    }

    return responseHandler(res, 200, "Updated todo status");
  } catch (error) {
    console.trace(error);
    next(error);
  }
};

/**
 * Deletes a Todo
 *
 * @route DELETE /api/v1/todo/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Function} next
 */
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const condition = { _id: id };
    const updatedData = await TodoModel.deleteOne(condition);

    if (!updatedData.deletedCount) {
      throw new CustomError("Todo Not Found", errorCodes.BAD_REQUEST, 400);
    }

    return responseHandler(res, 200, "Confirmation of todo deletion");
  } catch (error) {
    console.trace(error);
    next(error);
  }
};

/**
 * Get list of only user
 *
 * @route GET /api/v1/todo/user-list
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Function} next
 */
exports.userList = async (req, res, next) => {
  try {
    const list = await UserModel.find(
      { role: userEnum.role.USER },
      { _id: 0, userId: "$_id", userName: 1 }
    ).lean();

    return responseHandler(res, 200, undefined, list);
  } catch (error) {
    console.trace(error);
    next(error);
  }
};
