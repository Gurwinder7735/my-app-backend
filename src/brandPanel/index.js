const router = require("express").Router();

router.use("/", require("./collections").Routes);
router.use("/", require("./workers").Routes);

module.exports = {
  routes: [router],
};
