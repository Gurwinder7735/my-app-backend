const router = require("express").Router();

router.use("/", require("./brands").Routes);

module.exports = {
  routes: [router],
};
