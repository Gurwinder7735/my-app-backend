const Joi = require('joi');
const validator = {};

validator.createCollectionValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    // password: Joi.string().required(),
  }),
};

validator.addCollection = {
  body: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
  }),
};
validator.createSubCollection = {
  body: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    material: Joi.string().required(),
    color: Joi.string().required(),
    quantity: Joi.number().required(),
    gtin: Joi.number().required(),
    description: Joi.string().required(),
  }),
};

validator.updateSubCollection = {
  body: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    material: Joi.string().required(),
    color: Joi.string().required(),
    gtin: Joi.any().required(),
    quantity: Joi.any().required(),
    description: Joi.string().required(),
  }),
};

validator.getCollections = {
  query: Joi.object({
    // role: Joi.string()
    //   .valid(APP.USER_ROLES.FACTORY_WORKER, APP.USER_ROLES.SALES_PERSON)
    //   .required(),
    page: Joi.string().required(),
    limit: Joi.string().required(),
    keyword: Joi.optional().empty(),

    // password: Joi.string().required(),
  }),
};
validator.getWatches = {
  query: Joi.object({
    // role: Joi.string()
    //   .valid(APP.USER_ROLES.FACTORY_WORKER, APP.USER_ROLES.SALES_PERSON)
    //   .required(),
    page: Joi.string().required(),
    limit: Joi.string().required(),
    keyword: Joi.optional().empty(),
    status: Joi.required().valid("1", "2", "3"),

    // password: Joi.string().required(),
  }),
};

module.exports = validator;
