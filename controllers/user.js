const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

    const resetPasswordToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { email },
      },
      process.env.SECRET_KEY
    );

    const user = await User.findOneAndUpdate({ email }, { resetPasswordToken });
    if (!user) throw Error("User does not exist");
    return res.send({ status: "sucess", resetPasswordToken });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const {
      body: { resetPasswordToken },
    } = req;
    if (!resetPasswordToken) throw Error("unauthorized");
    let payload = jwt.verify(resetPasswordToken, process.env.SECRET_KEY);
    const user = await User.findOne({ email: payload.data.email });
    if (user.email !== payload.data.email) throw Error("Token Expired");
    res.send({ status: "success", message: "token verified" });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const {
      body: { newPassword, resetPasswordToken },
    } = req;
    if (!resetPasswordToken) throw Error("unauthorized");

    let payload = jwt.verify(resetPasswordToken, process.env.SECRET_KEY);
    const user = await User.findOne({ email: payload.data.email });

    if (user.resetPasswordToken !== resetPasswordToken)
      throw Error("Token Invalid");
    user.password = newPassword;
    user.resetPasswordToken = "";
    await user.save();
    res.send({ status: "success", message: "password updated" });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};
