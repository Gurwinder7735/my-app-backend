const Joi = require("joi");
const validator = {};

validator.updateWatchStatus = {
  params: Joi.object({
    status: Joi.any().valid("1", "2", "3").required(),
    watchId: Joi.any().required(),
  }),
  body: Joi.object({
    verificationCode: Joi.string().optional(),
  }),
};
validator.getWatchesListing = {
  query: Joi.object({
    page: Joi.string().required(),
    limit: Joi.string().required(),
    keyword: Joi.optional().empty(),
  }),
};

module.exports = validator;
