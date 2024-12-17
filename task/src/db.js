const mongoose = require("mongoose");

mongoose.connect(process.env.HOST, console.log("DB connected"));

module.exports = mongoose;
