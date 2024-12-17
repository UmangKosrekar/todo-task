const { model, Schema, Types } = require("mongoose");
const { todoEnum } = require("../constants/enum");

const schema = new Schema(
  {
    title: {
      type: String,
      index: "text"
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(todoEnum.status),
      default: todoEnum.status.PENDING
    },
    userId: {
      type: Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

const TodoModel = model("todo", schema, "todo");

module.exports = { TodoModel };
