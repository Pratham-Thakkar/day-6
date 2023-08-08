const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/talent", userRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("DB Connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
