const router = require("express").Router();

const CONSTANTS = require("../../../constants/constants.js");
const {
  authenticateRole,
} = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator.js");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.get(
  "/sales-person/generate-random-code",
  [
    authenticateRole([
      CONSTANTS.APP.USER_ROLES.SALES_PERSON,
    ]),
  ],
  controller.generateRandomCode
);

router.put(
  "/sales-person/update-verification-code",
  [
     authenticateRole([
       CONSTANTS.APP.USER_ROLES.SALES_PERSON,
    ]),
    validator.body(validators.updateRandomCode.body)
  ],
  
  controller.updateVerificationCode
);

router.get(
  "/sales-person/check-verification-code",
  [
     authenticateRole([
       CONSTANTS.APP.USER_ROLES.SALES_PERSON,
    ]),
    validator.body(validators.checkVerificationCode.body)
  ],
  
  controller.checkVerificationCode
);


module.exports = router;
