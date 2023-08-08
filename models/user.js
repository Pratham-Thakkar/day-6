const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userModel = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: " ",
  },
});

userModel.pre("save", async function () {
  (this.email = this.email.toLowerCase()),
    (this.password = await bcrypt.hash(this.password, 10));
});

module.exports = mongoose.model("User", userModel);
