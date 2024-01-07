'use strict';
require('dotenv').config();
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
const [commonAPI, brandApi, adminApi, mobileApi] = require("./src").routes;

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

app.use("/mail", (req, res) => {
  return res.render("mailTemplates/ownership-transfer-brand.ejs", {
    brandName: "Frannk Muller",
    watchModel: "password",
    watchId: "Factory Worker",
    ownerName: "df",
    lastOwner: "Guriwnder",
    newOwner: "Surinder"
  });
});

app.get(
  "/generate-qr",
  (req, res) => {
    const size = req?.query?.size || 300;
    const data = req?.query?.data || "No data"; // Change this to your desired data
    const options = {
      type: 'svg',
      width: size,
      height: size,
    };

    QRCode.toString(data, options, (err, svgString) => {
      if (err) throw err;

      const emailTemplate = fs.readFileSync(
        path.join(
          __dirname,
          "/public/views/qrcode.ejs"
        ),
        "utf-8"
      );
  
      const renderedTemplate = ejs.render(emailTemplate, {
        svgString,
        code: req?.query?.data
      });

      res.send(renderedTemplate);
      console.log(svgString);
    });
  }
);

app.use("*", (req, res) => {
  throw new AppError("Not found", STATUS_CODES.NOT_FOUND);
});


console.log(SMTP);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("server is listening on port" + process.env.PORT);
});


module.exports = app;
