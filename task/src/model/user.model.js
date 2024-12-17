const { model, Schema } = require("mongoose");
const { userEnum } = require("../constants/enum");
const bcrypt = require("bcrypt");

const schema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(userEnum.role),
      default: userEnum.role.USER
    }
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.validatePassword = async function validatePassword(data) {
  return await bcrypt.compare(data, this.password);
};

const UserModel = model("user", schema, "user");

module.exports = { UserModel };
