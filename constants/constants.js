"use strict";

const Joi = require("joi");

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET_KEY: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}



const SERVER = {
  APP_NAME: "App Name",
  TOKEN_EXPIRATION: 60 * 60 * 24 * 30, // expires in 24 hours * 7 days
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PORT: process.env.port || 3000,
  PAYMENT_GATEWAY: {
    URL: "",
    BASIC_PATH: "",
  },
  GOOGLE_GOOGLE_CAPTCHA_SECRET_KEY: process.env.GOOGLE_CAPTCHA_SECRET_KEY,
};

const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USERNAME: process.env.SMTP_USERNAME,
  PASSWORD: process.env.SMTP_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
};

const DATABASE = {

  // MONGO DB
  CONFIG: {
    DEVELOPMENT: {
     MONGO_URI: `mongodb://localhost:27017/${process.env.CI_MONGO_DB_NAME}`
    },
    TEST: {
     MONGO_URI: `mongodb+srv://${process.env.CI_MONGO_DB_USER}:${process.env.CI_MONGO_DB_PASSWORD}@${process.env.CI_MONGO_DB_HOST}/${process.env.CI_MONGO_DB_NAME}`
    },
    PRODUCTION: {
     MONGO_URI: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}`
    }
  },

  // MYSQL
  // CONFIG: {
  //   CIELOPMENT: {
  //     USERNAME: process.env.CI_DB_USERNAME,
  //     PASSWORD: process.env.DEV_DB_PASSWORD,
  //     DATABASE: process.env.DEV_DB_NAME,
  //     HOST: process.env.DEV_DB_HOST,
  //     DIALECT: "mysql",
  //   },
  //   TEST: {
  //     USERNAME: process.env.CI_DB_USERNAME,
  //     PASSWORD: process.env.CI_DB_PASSWORD,
  //     DATABASE: process.env.CI_DB_NAME,
  //     HOST: process.env.CI_DB_HOST,
  //     DIALECT: "mysql",
  //   },
  //   PRODUCTION: {
  //     USERNAME: process.env.PROD_DB_USERNAME,
  //     PASSWORD: process.env.PROD_DB_PASSWORD,
  //     DATABASE: process.env.PROD_DB_NAME,
  //     HOST: process.env.PROD_DB_HOST,
  //     DIALECT: "mysql",
  //   },
  // },

  USER_ROLES: {
    1: "USER",
    2: "BUSINESS",
  },

  DEVICE_TYPES: {
    1: "IOS",
    2: "ANDROID",
  },

  LANGUAGE: {
    EN: "EN",
    AR: "AR",
  },

  STATUS: {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED",
    INACTIVE: "INACTIVE",
  },

  DEFAULT_IMAGE: {
    ORIGINAL: "https://www.femina.in/images/default-user.png",
    THUMBNAIL: "https://www.femina.in/images/default-user.png",
  },

  CHAT_TYPE: {
    ONE_TO_ONE_CHAT: "ONE_TO_ONE_CHAT",
    GROUP_CHAT: "GROUP_CHAT",
  },
};

const APP = {
  USER_ROLES: {
    ADMIN: "ADMIN",
    BRAND: "BRAND",
    USER: "USER",
    FACTORY_WORKER: "FACTORY_WORKER",
    SALES_PERSON: "SALES_PERSON",
  },
  FRONT_END_URL: process.env.FRONT_END_URL,
  OWNERSHIP_TRANSFER_FEE: 50,
  OWNERSHIP_REQUEST_STATUS: {
    PENDING: "1",
    APPROVED: "2",
    REJECTED: "3",
    CANCELLED: "4",
  },
  WATCH_STATUS: {
    UNVERIFIED: "1",
    VERIFIED: "2",
    SOLD: "3",
  },
};
const CONSTANTS = {
  SERVER: SERVER,
  DATABASE: DATABASE,
  SMTP: SMTP,
  APP: APP,
};



module.exports = CONSTANTS;
