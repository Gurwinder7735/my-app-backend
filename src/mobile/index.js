const router = require("express").Router();

router.use("/", require("./factoryWorker").Routes);
router.use("/", require("./user").Routes);
router.use("/", require("./salesPerson").Routes);

module.exports = {
  routes: [router],
};
