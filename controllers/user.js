const User = require("../models/user");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;
    const user = new User({ email, password });
    await user.save();
    return res.send({ status: "sucess", message: "user added" });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const {
      body: { email },
    } = req;
    if (!email) throw Error("email not provided");
    const user = await User.findOne({ email });
    if (!user) throw Error("User does not exist");
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { email },
      },
      process.env.SECRET_KEY
    );
    console.log(token);
    user.token = token;
    await user.save();
    return res.send({ status: "sucess", token });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const {
      body: { token, id },
    } = req;
    if (!id || !token) throw Error("unauthorized");
    const user = await User.findOne({ _id: id });
    let payload = jwt.verify(token, process.env.SECRET_KEY);
    if (user.email !== payload.data.email) throw Error("Token Expired");
    res.send({ status: "success", message: "token verified" });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const {
      body: { newPassword, id, token },
    } = req;
    const user = await User.findOne({ _id: id });
    if (user.token !== token) throw Error("Token Invalid");
    let payload = jwt.verify(token, process.env.SECRET_KEY);
    if (user.email !== payload.data.email) throw Error("Token Expired");
    user.password = newPassword;
    user.token = " ";
    user.save();
    res.send({ status: "success", message: "password updated" });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};
