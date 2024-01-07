const logger = require("../config/logger");

module.exports = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
 
  req.payload = { ...req.body, ...req.query };

  if (process.env.NODE_ENV == "development") {
    global.baseUrl = `http://192.168.1.110:5200`;
  } else {
    global.baseUrl = `${req.protocol}://${req.get("host")}`;
  }
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  return next();
};
