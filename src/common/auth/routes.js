const router = require("express").Router();

const { APP } = require("../../../constants/constants.js");
const { authenticateRole } = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.post(
  "/login",
  [validator.body(validators.login.body)],
  controller.login
);
router.patch("/logout", [authenticateRole()], controller.logout);
router.delete(
  "/remove-account",
  [
    authenticateRole(
      APP.USER_ROLES.FACTORY_WORKER,
      APP.USER_ROLES.SALES_PERSON
    ),
  ],
  controller.deleteAccount
);
router.post(
  "/register",
  [validator.body(validators.registerUser.body)],
  controller.registerUser
);

router.get("/profile", [authenticateRole()], controller.getProfile);
router.get(
  "/check-email",
  [validator.query(validators.checkEmail.query)],
  controller.checkEmail
);
router.get(
  "/check-phone",
  [validator.query(validators.checkPhone.query)],
  controller.checkPhone
);

router.post(
  "/worker",
  [authenticateRole(), validator.body(validators.addWorker.body)],
  controller.addWorker
);

router.post(
  "/forgot-password",
  [validator.body(validators.forgotPassword.body)],
  controller.forgotPassword
);

router.post(
  "/resend-otp",
  [validator.body(validators.resendOtp.body)],
  controller.resendOtp
);

router.post(
  "/verify-otp",
  [validator.body(validators.verifyOtp.body)],
  controller.verifyOtp
);

router.post(
  "/reset-password",
  [validator.body(validators.resetPassword.body)],
  controller.resetPassword
);

router.post(
  "/change-password",
  [authenticateRole(), validator.body(validators.changePassword.body)],
  controller.changePassword
);

router.post(
  "/verify-recaptcha",
  [validator.body(validators.verifyRecaptca.body)],
  controller.verifyRecaptca
);

router.post(
  "/brands/register",
  [validator.body(validators.registerBrand.body)],
  controller.registerBrand
);


router.post(
  "/file-upload",
  // [validator.body(validators.registerBrand.body)],
  controller.uploadFile
);


router.post(
  "/check-already-exists",
  [validator.body(validators.checkAlreadyExists.body)],
  controller.checkAlreadyExists
);



module.exports = router;
