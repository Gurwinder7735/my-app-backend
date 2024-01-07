const Joi = require("joi");
const validator = {};


validator.updateRandomCode = {
  body: Joi.object({
    watchId: Joi.any().required(),
    verificationCode: Joi.string().length(4).required()
  }),
};

validator.checkVerificationCode = {
  body: Joi.object({
    verificationCode: Joi.string().length(4).required()
  }),
};

module.exports = validator;
