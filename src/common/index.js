const router = require('express').Router();



router.use("/auth", require("./auth").Routes);

module.exports = {
  routes: [router],
};
