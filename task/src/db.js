const mongoose = require("mongoose");

console.log(process.env.HOST);

mongoose.connect(process.env.HOST, console.log("DB connected"));

module.exports = mongoose;
