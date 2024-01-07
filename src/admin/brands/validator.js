const Joi = require("joi");
const validator = {};

validator.approveRejectRequest = {
  params: Joi.object({
    id: Joi.string().required(),
    status: Joi.any().valid("1", "2", "3").required(),
  }),
};

module.exports = validator;


