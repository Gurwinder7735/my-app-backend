const logger = require("../config/logger");
const {
  sendError,
  getResponseMessage,
} = require("../utils/response/responseUtils");

module.exports = (err, req, res, next) => {

  console.log(err, "error");

  if (err && err.error && err.error.isJoi) {
    err.message = err.error.details[0].message.replace(/\"/g, "") || "error";
    err.statusCode = 400;
  } else {
    logger.error(err.stack);
    console.log(err.message, "message");
    err.message = getResponseMessage(err.message);
  }
  return sendError(err, req, res);
};
