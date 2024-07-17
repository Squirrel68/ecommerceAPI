"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://127.0.0.1:27017/shop";

mongoose
  .connect(connectString)
  .then((_) => console.log("Connected mongodb success"))
  .catch((err) => console.log(err));

module.exports = mongoose;
