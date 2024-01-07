const router = require("express").Router();

const CONSTANTS = require("../../../constants/constants.js");
const {
  authenticateRole,
} = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});


router.get(
  "/user/test-route",
  // [
  //   authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
  //   validator.params(validators.claimOwnership.params),
  //   validator.body(validators.claimOwnership.body),
  // ],
  controller.testController
);

// router.get(
//   "/user/transfer-ownership-request/:requestId",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.params(validators.transferOwnershipRequestDetails.params),
//   ],
//   controller.transferOwnershipRequestDetails
// );

// router.get(
//   "/user/transfer-ownership/:watchId",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.params(validators.transferOwnershipRequest.params),
//   ],
//   controller.transferOwnershipRequest
// );

// router.patch(
//   "/user/transfer-ownership/:requestId/approve-reject/:status",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.params(validators.approveRejectTransferRequest.params),
//   ],
//   controller.approveRejectTransferRequest
// );

// router.post(
//   "/user/transfer-ownership/payment/:requestId/:type",
//   [
//     // authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.params(validators.makeTransferOwnershipPayment.params),
//   ],
//   controller.makeTransferOwnershipPayment
// );

// router.patch(
//   "/user/transfer-ownership/payment-success/:orderId",
//   [
//     // authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.params(validators.paymentSuccess.params),
//   ],
//   controller.paymentSuccess
// );

// router.get(
//   "/user/notifications",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.query(validators.getNotifications.query),
//   ],
//   controller.getNotificationsListing
// );

// router.patch(
//   "/user/notifications/:id/:status",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.params(validators.updateNotificationStatus.params),
//   ],
//   controller.updateNotificationStatus
// );

// router.get(
//   "/user/profile",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//   ],
//   controller.getUserProfile
// );


// router.put(
//   "/user/profile",
//   [
//     authenticateRole([CONSTANTS.APP.USER_ROLES.USER]),
//     validator.body(validators.updateUserProfile.body),
//   ],
//   controller.updateUserProfile
// );


// router.get("/user/test", controller.testRoute)



module.exports = router;
