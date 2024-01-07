'use strict';
require('dotenv').config();
require('./config/config')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const fs = require("fs");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
var QRCode = require('qrcode')

const db = require("./models");
const baseMiddleware = require("./middleware/baseMiddleware");
const errorHandler = require("./middleware/errorHandler");

const passport = require("./middleware/passport");
const CONSTANTS = require("./constants/constants");
const AppError = require("./utils/errorHandlers/appError");
const { STATUSCODE, SMTP } = require("./constants/constants");
const STATUS_CODES = require("./utils/response/statusCodes");


const app = express();

// ROUTES
const [ webRoutes] = require("./src").routes;

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "ejs");

// MIDDLEWARES
app.use(passport.initialize());
app.use(logger("dev"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(baseMiddleware);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

if (process.env.COMMON_ROUTES == "true") {
  app.use("/api", commonAPI);
}

if (process.env.USER_ROUTES == "true") {
  app.use("/api", brandApi);
}
if (process.env.ADMIN_ROUTES == "true") {
  app.use("/api", adminApi);
}
if (process.env.MOBILE_ROUTES == "true") {
  app.use("/api", mobileApi);
}
if (process.env.WEB_ROUTES == "true") {
  app.use("/api", webRoutes);
}


app.use("*", (req, res) => {
  throw new AppError("Not found", STATUS_CODES.NOT_FOUND);
});


console.log(SMTP);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("SERVER IS RUNNING ON PORT : " + process.env.PORT);
});


module.exports = app;
