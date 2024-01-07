const Joi = require("joi");
const { APP } = require("../../../constants/constants");
const validator = {};

validator.getWorkers = {
  query: Joi.object({
    role: Joi.string()
      .valid(APP.USER_ROLES.FACTORY_WORKER, APP.USER_ROLES.SALES_PERSON)
      .required(),
    page: Joi.string().required(),
    limit: Joi.string().required(),
    keyword: Joi.optional().empty(),
    // password: Joi.string().required(),
  }),
};
validator.updateWorker = {
  body: Joi.object({
    id: Joi.optional().empty(),
    firstName: Joi.optional().empty(),
    lastName: Joi.optional().empty(),
    // password: Joi.string().required(),
  }),
};

module.exports = validator;
