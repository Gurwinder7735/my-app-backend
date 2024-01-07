const Joi = require("joi");
const validator = {};

validator.updateWatchStatus = {
  params: Joi.object({
    status: Joi.any().valid("1", "2", "3").required(),
    watchId: Joi.any().required(),
  }),
};
validator.claimOwnership = {
  params: Joi.object({
    watchId: Joi.string().required(),
  }),
  body: Joi.object({
    verificationCode: Joi.string().optional(),
  }),
};
validator.transferOwnershipRequest = {
  params: Joi.object({
    watchId: Joi.string().required(),
  }),
};
validator.transferOwnershipRequestDetails = {
  params: Joi.object({
    requestId: Joi.string().required(),
  }),
};
validator.approveRejectTransferRequest = {
  params: Joi.object({
    requestId: Joi.string().required(),
    status: Joi.any().valid("2", "3", "4").required(),
  }),
};
validator.makeTransferOwnershipPayment = {
  params: Joi.object({
    requestId: Joi.string().required(),
    type: Joi.any().valid("card", "paypal", "ideal").required(),
  }),
};
validator.paymentSuccess = {
  params: Joi.object({
    orderId: Joi.string().required(),
  }),
};


validator.getNotifications = {
  query: Joi.object({
    page: Joi.string().required(),
    limit: Joi.string().required(),
    keyword: Joi.optional().empty(),
  }),
};

validator.updateNotificationStatus = {
  params: Joi.object({
    status: Joi.any().valid("0", "1").required(),
    id: Joi.string().required(),
  }),
};
validator.updateUserProfile = {
  body: Joi.object({
    image: Joi.optional(),
    name: Joi.string().optional(),
    nameVisibility: Joi.number().optional().valid(0, 1).empty(),
    imageVisibility: Joi.number().optional().valid(0, 1).empty(),
  }),
};

module.exports = validator;
