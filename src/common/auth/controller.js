const db = require("../../../models");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { sendSuccess } = require("../../../utils/response/responseUtils");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const AppError = require("../../../utils/errorHandlers/appError");
const catchAsync = require("../../../utils/errorHandlers/catchAsync");
const Models = require("../../../models");
const {
  encryptPassword,
  comparePassword,
  generateOtp,
  generateRandomToken,
  generateRandomPassword,
  verifyRecaptchaCode,
} = require("../../../utils/utils");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const {
  getUser,
  findRoleId,
  sendOtpMail,
  sendCredientialsOnEmail,
  updateDeviceInfo,
  sendResetPasswordMail,
  sendBrandRegisterMail,
  sendWelcomeMailtoUser,
} = require("./controllerUtils");
const { APP } = require("../../../constants/constants");
const RESPONSE_MSGS = require("../../../utils/response/responseMessages");
const CONSTANTS = require("../../../constants/constants");
const { Op } = require("sequelize");

module.exports = {
  getUser: catchAsync(async (req, res, next) => {
    next(new AppError(STATUS_MSG.SUCCESS.DEFAULT, 500));
  }),

  login: catchAsync(async (req, res, next) => {
    let admin = await getUser(req.payload);

    // return res.json(admin);

    // ROLE SPECIFIC CHECK
    // if (!admin || admin?.UserRole?.Role?.roleName !== req.payload.role) {
    //   return next(new AppError(STATUS_MSG.ERROR.INVALID_CREDIENTIALS));
    // }

    // return res.json(admin);

    if (!admin) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.INVALID_CREDIENTIALS,
          STATUS_CODES.UNAUTHORIZED
        )
      );
    }

    if (!req.payload.role.includes(admin.UserRole.Role.roleName)) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.INVALID_CREDIENTIALS,
          STATUS_CODES.UNAUTHORIZED
        )
      );
    }

    // res.send(admin.UserRole.Role.roleName);

    const passwordMatch = comparePassword(req.payload.password, admin.password);

    if (!passwordMatch) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.INVALID_CREDIENTIALS,
          STATUS_CODES.UNAUTHORIZED
        )
      );
    }

    if (admin?.UserRole?.Role?.roleName === APP.USER_ROLES.BRAND) {
      if (admin?.BrandDetail?.status == 1) {
        return next(new AppError(STATUS_MSG.ERROR.APPROVAL_PENDING));
      }
      if (admin?.BrandDetail?.status == 3) {
        return next(new AppError(STATUS_MSG.ERROR.APPROVAL_PENDING));
      }
    }

    delete admin.dataValues.password;
    admin.dataValues.token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin?.UserRole?.Role?.roleName,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: req.payload.rememberMe ? "30d" : process.env.JWT_EXPIRE_TIME,
      }
    );
    delete admin.password;
    delete admin.dataValues.UserRole;
    admin.dataValues.role = admin?.UserRole?.Role?.roleName;
    admin.dataValues.deviceType = req.payload?.deviceType ?? admin?.deviceType;
    admin.dataValues.deviceToken =
      req.payload?.deviceToken ?? admin?.deviceToken;

    if (req.payload.deviceType && req.payload.deviceToken) {
      const update = await updateDeviceInfo(admin.id, {
        deviceType: req?.payload?.deviceType,
        deviceToken: req?.payload?.deviceToken,
      });
      console.log(update, "updateDeviceInfo");
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.LOGIN_SUCCESS,
      admin
    );
  }),
  logout: catchAsync(async (req, res, next) => {
    const update = await Models.Users.update(
      {
        deviceToken: "",
      },
      {
        where: {
          id: req.auth.id,
        },
      }
    );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.LOGIN_SUCCESS
    );
  }),

  deleteAccount: catchAsync(async (req, res, next) => {
    const update = await Models.Users.destroy({
      where: {
        id: req.auth.id,
      },
    });

    if (update) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.ACCOUNT_REMOVED_SUCCESS
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.DEFAULT));
    }
  }),
  logout: catchAsync(async (req, res, next) => {
    const update = await Models.Users.update(
      {
        deviceToken: "",
      },
      {
        where: {
          id: req.auth.id,
        },
      }
    );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.LOGIN_SUCCESS
    );
  }),

  forgotPassword: catchAsync(async (req, res, next) => {
    // const admin = await Models.Users.findOne({
    //   where: {
    //     email: req.payload.email,
    //   },
    // });
    const admin = await getUser({email: req.payload.email})


    if (!admin) {
      return next(new AppError(STATUS_MSG.ERROR.EMAIL_NOT_EXISTS));
    }

    const otp = generateOtp();

    const resetToken = await generateRandomToken(64);
    const resetLink = `${CONSTANTS.APP.FRONT_END_URL}/create-new-password/${resetToken}?type=app`;

    const updateOtp = await Models.Users.update(
      {
        ...(req.payload.type == 1 ? { otp } : { resetToken }),
      },
      {
        where: {
          id: admin.id,
        },
      }
    );

    console.log(admin,"admin")

    if (updateOtp) {
      const mailSent =
        req.payload.type == 1
          ? await sendOtpMail(admin?.name?.split(" ")[0] || admin?.BrandDetail?.contactPerson?.split(" ")[0],req.payload.email, otp)
          : sendResetPasswordMail(req.payload.email, resetLink);

      console.log(mailSent, "mailSent successfully");
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        req.payload.type == 1
          ? STATUS_MSG.SUCCESS.OTP_SENT_SUCCESS
          : STATUS_MSG.SUCCESS.LINK_SUCCESS,
        {
          ...(req.payload.type == 1
            ? {}
            : {
                resetPasswordLink: `${CONSTANTS.APP.FRONT_END_URL}/create-new-password/${resetToken}?type=app`,
              }),
        }
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.OTP_SENT_FAILED));
    }
  }),

  verifyOtp: catchAsync(async (req, res, next) => {
    const admin = await Models.Users.findOne({
      where: {
        email: req.payload.email,
      },
    });

    if (!admin) {
      return next(new AppError(STATUS_MSG.ERROR.EMAIL_NOT_EXISTS));
    }

    if (admin.otp === req.payload.otp) {
      const resetToken = await generateRandomToken(64);
      const updateToken = await Models.Users.update(
        {
          otp: null,
          resetToken,
        },
        {
          where: {
            id: admin.id,
          },
        }
      );

      if (updateToken) {
        return sendSuccess(
          req,
          res,
          STATUS_CODES.SUCCESS,
          STATUS_MSG.SUCCESS.OTP_MATCHED,
          {
            resetToken,
          }
        );
      } else {
        return next(new AppError("Failed to create password reset token"));
      }
    } else {
      return next(new AppError(STATUS_MSG.ERROR.OTP_NOT_MATCH));
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    const admin = await Models.Users.findOne({
      where: {
        resetToken: req.payload.resetToken,
      },
    });

    if (!admin) {
      return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
    }

    if (admin.resetToken === req.payload.resetToken) {
      const updatePassword = await Models.Users.update(
        {
          resetToken: "",
          password: encryptPassword(req.payload.newPassword),
        },
        {
          where: {
            id: admin.id,
          },
        }
      );

      if (updatePassword) {
        return sendSuccess(
          req,
          res,
          STATUS_CODES.SUCCESS,
          STATUS_MSG.SUCCESS.PASSWORD_CHANGE_SUCCESS
        );
      } else {
        return next(new AppError("Failed to create password reset token"));
      }
    } else {
      return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
    }
  }),
  changePassword: catchAsync(async (req, res, next) => {
    const { id } = req.auth;
    const { oldPassword, newPassword } = req.payload;

    const user = await Models.Users.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
    }

    const isPasswordMatch = comparePassword(oldPassword, user?.password);

    if (isPasswordMatch) {
      const updatePassword = await Models.Users.update(
        {
          password: encryptPassword(newPassword),
        },
        {
          where: {
            id,
          },
        }
      );

      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.PASSWORD_CHANGE_SUCCESS
      );
    } else {
      return next(
        new AppError(
          STATUS_MSG.ERROR.INCORRECT_OLD_PASSWORD,
          STATUS_CODES.APP_ERROR
        )
      );
    }
  }),

  registerBrand: catchAsync(async (req, res, next) => {
    let user = await Models.Users.findOne({
      where: {
        email: req.payload.email,
      },
    });

    if (user) {
      return next(new AppError(STATUS_MSG.ERROR.EMAIL_ALREADY_EXISTS));
    }

    user = await Models.Users.create({
      email: req.payload.email,
      password: encryptPassword(req.payload.password),
    });

    if (user) {
      const brandDetail = Models.BrandDetails.create({
        userId: user.id,
        ...req.payload,
      });

      const createRole = Models.UserRoles.create({
        userId: user.id,
        roleId: 2,
      });

      await Promise.all([brandDetail, createRole]);

      sendBrandRegisterMail(user.email, req.payload.contactPerson);

      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.DEFAULT
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.DEFAULT));
    }

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),
  checkEmail: catchAsync(async (req, res, next) => {
    const emailExists = await Models.Users.count({
      where: {
        email: req.payload.email,
      },
    });

    if (Boolean(emailExists)) {
      return next(new AppError(STATUS_MSG.ERROR.EMAIL_ALREADY_EXISTS));
    } else {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.DEFAULT
      );
    }

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),

  checkPhone: catchAsync(async (req, res, next) => {
    const phoneExists = await Models.BrandDetails.count({
      where: {
        phoneNumber: req.payload.phoneNumber,
      },
    });

    if (Boolean(phoneExists)) {
      return next(new AppError(STATUS_MSG.ERROR.PHONE_ALREADY_EXISTS));
    } else {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.DEFAULT
      );
    }

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),

  registerUser: catchAsync(async (req, res, next) => {
    let user = await Models.Users.findOne({
      where: {
        email: req.payload.email,
      },
    });

    if (user) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.EMAIL_ALREADY_EXISTS,
          STATUS_CODES.CONFLICT
        )
      );
    }

    user = await Models.Users.create({
      ...req.payload,
      password: encryptPassword(req.payload.password),
    });

    if (user) {
      const createRole = await Models.UserRoles.create({
        userId: user.id,
        roleId: 3,
      });

      user = await getUser(req.payload);
      user = user.toJSON();

      user.role = user?.UserRole?.Role?.roleName;
      delete user.UserRole;
      delete user.password;

      sendWelcomeMailtoUser(user?.email, req.payload?.name?.split(" ")[0])

      user.token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          expiresIn: process.env.JWT_EXPIRE_TIME,
        },
        process.env.JWT_SECRET_KEY
      );

      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.REGISTER_SUCCESS,
        user
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.DEFAULT));
    }

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),
  getProfile: catchAsync(async (req, res, next) => {
    const { id } = req.auth;
    // const role = await findRoleId({ type:  APP.USER_ROLES.BRAND });

    const includeOptions = [
      {
        model: Models.UserRoles,
        where: {
          // roleId: role,
        },
        include: {
          model: Models.Roles,
        },
        attributes: ["roleId"],
      },
      {
        model: Models.BrandDetails,
      },
    ];

    const brand = await Models.Users.findOne({
      where: {
        id,
      },
      include: includeOptions,
    });

    if (!brand) {
      return next(
        new AppError(STATUS_MSG.ERROR.DEFAULT, STATUS_CODES.APP_ERROR)
      );
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      brand
    );

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),
  addWorker: catchAsync(async (req, res, next) => {
    const { type, ...payload } = req.payload;

    let user = await Models.Users.findOne({
      where: {
        email: req.payload.email,
      },
    });

    if (user) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.EMAIL_ALREADY_EXISTS,
          STATUS_CODES.CONFLICT
        )
      );
    }

    const randomPassword = generateRandomPassword(8);

    payload.brandId = req?.auth?.id;

    user = await Models.Users.create({
      ...payload,
      name: payload.firstName + " " + payload.lastName,
      password: encryptPassword(randomPassword),
    });

    if (user) {
      const roleId = await findRoleId(req.payload);
      const createRole = await Models.UserRoles.create({
        userId: user.id,
        roleId,
      });

      user = await getUser(req.payload);
      user = user.toJSON();

      user.role = user?.UserRole?.Role?.roleName;
      delete user?.UserRole;
      delete user?.password;

      // if (process.env.NODE_ENV != "development") {
      const mailSent = await sendCredientialsOnEmail(
        payload.firstName,
        user.email,
        randomPassword,
        (role =
          req.body.type == APP.USER_ROLES.FACTORY_WORKER
            ? "Factory Worker"
            : "Sales Person")
      );
      console.log(mailSent, "mailSent");
      // }

      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.REGISTER_SUCCESS
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.DEFAULT));
    }

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),

  resendOtp: catchAsync(async (req, res, next) => {
    const { email } = req.payload;

    const user = await getUser({email: req.payload.email})

    if (!user) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.EMAIL_NOT_EXISTS,
          STATUS_CODES.BAD_REQUEST
        )
      );
    }

    const otp = generateOtp();

    const updateOtp = await Models.Users.update(
      {
        otp,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    if (updateOtp) {
      const mailSent = sendOtpMail(user?.name?.split(" ")[0] || user?.BrandDetail?.contactPerson?.split(" ")[0],email, otp);
      console.log(mailSent, "mailSent successfully");

      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.OTP_SENT_SUCCESS
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.OTP_SENT_FAILED));
    }

    // return next(new AppError(STATUS_MSG.ERROR.INVALID_TOKEN));
  }),

  verifyRecaptca: catchAsync(async (req, res, next) => {
    const { recaptchaResponse } = req.payload;

    const isVerified = await verifyRecaptchaCode(recaptchaResponse);

    if (!isVerified) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.VERIFICATION_EXPIRED,
          STATUS_CODES.BAD_REQUEST
        )
      );
    } else {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.SUCCESS
      );
    }
  }),

  uploadFile: catchAsync(async (req, res, next) => {
    // Create the destination folder if it doesn't exist

    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = Date.now() + req.files.image.name;
    const filePath = req.files.image.tempFilePath;
    const folderName = req.body.folderName || "images";
    const destinationFolder = path.join(
      __dirname + "../../../../public/uploads/",
      folderName + "/" + fileName
    );

    fs.copyFileSync(filePath, destinationFolder);
    fs.unlinkSync(filePath); // Remove the temporary file

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      {
        image: `/uploads/${folderName}/${fileName}`,
      }
    );
  }),

  protected: catchAsync(async (req, res, next) => {
    console.log("inside protected route");
  }),

  checkAlreadyExists: catchAsync(async (req, res, next) => {
    const { modelName, fields, id } = req.payload;

    console.log(req.payload, "payload already exists");

    let where = {};
    if (id) {
      where = {
        ...fields,
        id: {
          [Op.notIn]: [id],
        },
      };
    } else {
      where = {
        ...fields,
      };
    }

    console.log(where, "where");
    // return;

    const entity = await Models[modelName].count({
      where,
    });

    if (!Boolean(entity)) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.DEFAULT
      );
    } else {
      return next(
        new AppError(STATUS_MSG.ERROR.ALREADY_EXISTS, STATUS_CODES.BAD_REQUEST)
      );
    }
  }),
  generateQR: catchAsync(async (req, res, next) => {


    // QRCode.toDataURL('I am a pony!', function (err, url) {
    //   console.log(url)
    //   res.send(url)
    // })

    // return res.json("Hi")

    // const { modelName, fields, id } = req.payload;

    // console.log(req.payload, "payload already exists");

    // let where = {};
    // if (id) {
    //   where = {
    //     ...fields,
    //     id: {
    //       [Op.notIn]: [id],
    //     },
    //   };
    // } else {
    //   where = {
    //     ...fields,
    //   };
    // }

    // console.log(where, "where");
    // // return;

    // const entity = await Models[modelName].count({
    //   where,
    // });

    // if (!Boolean(entity)) {
    //   return sendSuccess(
    //     req,
    //     res,
    //     STATUS_CODES.SUCCESS,
    //     STATUS_MSG.SUCCESS.DEFAULT
    //   );
    // } else {
    //   return next(
    //     new AppError(STATUS_MSG.ERROR.ALREADY_EXISTS, STATUS_CODES.BAD_REQUEST)
    //   );
    // }
  }),
};
