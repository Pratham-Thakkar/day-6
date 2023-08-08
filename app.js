const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/talent", userRoutes);

mongoose
  .connect(
    "mongodb+srv://pratham:c0At7haKCjB2wKq7@cluster0.hfa5lw3.mongodb.net/"
  )
  .then(() => {
    console.log("DB Connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
