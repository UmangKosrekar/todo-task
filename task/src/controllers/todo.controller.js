const { errorCodes, userEnum } = require("../constants/enum");
const { responseHandler, CustomError } = require("../helper");
const { TodoModel, UserModel } = require("../model");

exports.createTodo = async (req, res, next) => {
  try {
    const { title, assignedTo } = req.body;

    const titleAlreadyUsed = await TodoModel.countDocuments({ title }).lean();

    if (titleAlreadyUsed) {
      throw new CustomError("Select Unique Title", errorCodes.BAD_REQUEST, 400);
    }
    const checkUser = await UserModel.findOne({ _id: assignedTo }).lean();
    if (!checkUser?.role === userEnum.role.USER) {
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

exports.listTodo = async (req, res, next) => {
  try {
    const { page, limit, key, desc, search, statusFilter } = req.query;

    const paginationQuery = [
      { $sort: { [key || "_id"]: desc ? -1 : 1 } },
      { $skip: ((Number(page) || 1) - 1) * (Number(limit) || 25) },
      { $limit: Number(limit) || 25 }
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

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const condition = { _id: id };
    if (req.user.role === userEnum.role.USER) {
      condition.userId = req.user._id;
    }
    const updatedData = await TodoModel.updateOne(condition, {
      $set: req.body
    });

    if (!updatedData.matchedCount) {
      throw new CustomError("Todo Not Found", errorCodes.BAD_REQUEST, 400);
    }

    return responseHandler(res, 200, "Updated todo status");
  } catch (error) {
    console.trace(error);
    next(error);
  }
};

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
