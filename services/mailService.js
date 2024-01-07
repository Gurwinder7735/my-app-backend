const nodemailer = require("nodemailer");
const { SMTP } = require("../constants/constants");

// const mailTransporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "hbnkedbodx4yrsal@ethereal.email",
//     pass: "XAtSZU1Xx2XrKPrM7J",
//   },
// });
const mailTransporter = nodemailer.createTransport({
  host: SMTP.HOST,
  port: SMTP.PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: SMTP.USERNAME,
    pass: SMTP.PASSWORD,
  },
});

module.exports = mailTransporter;
