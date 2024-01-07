const router = require("express").Router();

const { authenticateRole } = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

// console.log(validator)
router.get(
  "/brands/workers",
  [authenticateRole(), validator.query(validators.getWorkers.query)],
  controller.getWorkersListing
);

router.get(
  "/brands/worker/:id",
  [authenticateRole()],
  controller.getWorkerDetails
);

router.patch(
  "/brands/worker/:id",
  [authenticateRole(), validator.body(validators.updateWorker.body)],
  controller.updateWorkerDetails
);

router.delete(
  "/brands/worker/:id",
  [authenticateRole()],
  controller.deleteWorker
);

module.exports = router;
