const router = require("express").Router();

const CONSTANTS = require("../../../constants/constants.js");
const {
  authenticateAdmin,
  authenticateRole,
} = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.get(
  "/factory/watches",
  [
    authenticateRole([
      CONSTANTS.APP.USER_ROLES.FACTORY_WORKER,
      CONSTANTS.APP.USER_ROLES.SALES_PERSON,
      CONSTANTS.APP.USER_ROLES.USER,
    ]),
    validator.query(validators.getWatchesListing.query),
  ],
  controller.getWatchesListing
);

router.get(
  "/factory/watch/:id",
  [
    authenticateRole([
      CONSTANTS.APP.USER_ROLES.FACTORY_WORKER,
      CONSTANTS.APP.USER_ROLES.SALES_PERSON,
      CONSTANTS.APP.USER_ROLES.USER,
    ]),
  ],
  controller.getWatchDetail
);

router.patch(
  "/factory/watch/:watchId/status/:status",
  [
    authenticateRole([
      CONSTANTS.APP.USER_ROLES.FACTORY_WORKER,
      CONSTANTS.APP.USER_ROLES.SALES_PERSON,
    ]),
    [validator.params(validators.updateWatchStatus.params),validator.body(validators.updateWatchStatus.body)],
  ],
  controller.updateWatchStatus
);

module.exports = router;
