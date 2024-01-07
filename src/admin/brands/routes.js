const router = require("express").Router();

const { authenticateRole } = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.get("/brands", [authenticateRole()], controller.getBrands);
router.get("/brands/:id", [authenticateRole()], controller.getBrandDetails);
router.put(
  "/brands/:id/:status",
  [
    authenticateRole(),
    [validator.params(validators.approveRejectRequest.params)],
  ],
  controller.approveRejectRequest
);

router.get(
  "/watch/:id",
  // [authenticateRole(CONSTANTS.APP.USER_ROLES.FACTORY_WORKER)],
  controller.getWatchDetail
);

router.get(
  "/transfer-ownership-request/:requestId",
  // [authenticateRole(CONSTANTS.APP.USER_ROLES.FACTORY_WORKER)],
  controller.getTransferRequestDetails
);


module.exports = router;
