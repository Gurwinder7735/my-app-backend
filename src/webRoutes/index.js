const router = require("express").Router();

router.use("/", require("./user").Routes);

module.exports = {
  routes: [router],
};
