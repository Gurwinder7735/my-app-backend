const Joi = require("joi");
const { APP } = require("../../../constants/constants");
const validator = {};

validator.login = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().optional(),
    role: Joi.array()
      .items(
        Joi.string().valid(
          APP.USER_ROLES.ADMIN,
          APP.USER_ROLES.BRAND,
          APP.USER_ROLES.USER,
          APP.USER_ROLES.FACTORY_WORKER,
          APP.USER_ROLES.SALES_PERSON
        )
      )
      .min(1)
      .required(),
    deviceType: Joi.number().optional(),
    deviceToken: Joi.optional(),
  }),
};

validator.forgotPassword = {
  body: Joi.object({
    email: Joi.string().required(),
    type: Joi.string().valid(1, 2).required(),
  }),
};

validator.resendOtp = {
  body: Joi.object({
    email: Joi.string().required(),
  }),
};

validator.verifyOtp = {
  body: Joi.object({
    email: Joi.string().required(),
    otp: Joi.number().required(),
  }),
};
validator.resetPassword = {
  body: Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
validator.changePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmNewPassword: Joi.string().required(),
  }),
};

validator.registerBrand = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().optional(),
    brandName: Joi.string().required(),
    legalBusinessName: Joi.optional(),
    contactPersonEmail: Joi.string().required(),
    contactPerson: Joi.string().required(),
    jobTitle: Joi.string().required(),
    website: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }),
};

validator.checkEmail = {
  query: Joi.object({
    email: Joi.string().required(),
  }),
};
validator.checkPhone = {
  query: Joi.object({
    phoneNumber: Joi.string().required(),
  }),
};

validator.registerUser = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
    deviceType: Joi.number().optional(),
    deviceToken: Joi.string().optional(),
  }),
};

validator.addWorker = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    type: Joi.string()
      .valid(APP.USER_ROLES.FACTORY_WORKER, APP.USER_ROLES.SALES_PERSON)
      .required(),
    deviceType: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
  }),
};

validator.verifyRecaptca = {
  body: Joi.object({
    recaptchaResponse: Joi.optional().empty(),
  }),
};

validator.checkAlreadyExists = {
  body: Joi.object({
    modelName: Joi.string().required(),
    id: Joi.any().optional(),
    fields: Joi.object().pattern(Joi.string(), Joi.any()).required(),
  }),
};

module.exports = validator;
