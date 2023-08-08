const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
