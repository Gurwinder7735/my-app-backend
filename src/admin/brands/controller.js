const db = require("../../../models");
const jwt = require("jsonwebtoken");

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
  getPaginatedResults,
  fetchWatchDetail,
} = require("../../../utils/utils");
const STATUS_CODES = require("../../../utils/response/statusCodes");

const { findRoleId } = require("../../common/auth/controllerUtils");
const { Op } = require("sequelize");
const { APP } = require("../../../constants/constants");
const { sendBrandApproveRejectMail } = require("./controllerUtils");
const {
  getTransferRequestDetails,
} = require("../../mobile/user/controllerUtils");

module.exports = {
  getBrands: catchAsync(async (req, res, next) => {
    const { page, limit = 10, keyword = "", status } = req.payload;

    const currentPage = Number(page); // Current page number

    const role = await findRoleId({ type: APP.USER_ROLES.BRAND });

    const includeOptions = [
      {
        model: Models.UserRoles,
        where: {
          roleId: role,
        },
        attributes: ["roleId"],
      },
      {
        model: Models.BrandDetails,
        where: {
          brandName: {
            [Op.like]: `%${keyword}%`, // Use the search keyword variable here
          },
          status,
        },
        required: true,
      },
    ];

    const brands = await getPaginatedResults(
      Models.Users,
      page,
      limit,
      {},
      {},
      includeOptions,
      { order: [["id", "DESC"]] }
    );

    const getOpenRequests = await Models.BrandDetails.count({
      where: {
        status: 1,
      },
    });
    const getAcceptedRequests = await Models.BrandDetails.count({
      where: {
        status: 2,
      },
    });

    const [openRequests, acceptedRequests] = await Promise.all([
      getOpenRequests,
      getAcceptedRequests,
    ]);

    brands.openRequests = openRequests;
    brands.acceptedRequests = acceptedRequests;

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.LOGIN_SUCCESS,
      brands
    );
  }),
  getBrandDetails: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const role = await findRoleId({ type: APP.USER_ROLES.BRAND });

    const includeOptions = [
      {
        model: Models.UserRoles,
        where: {
          roleId: role,
        },
        attributes: ["roleId"],
      },
      {
        model: Models.BrandDetails,
        required: true,
      },
    ];

    const brand = await Models.Users.findOne({
      where: {
        id,
      },
      include: includeOptions,
    });

    if (!brand) {
      return next(new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST));
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      brand
    );
  }),
  approveRejectRequest: catchAsync(async (req, res, next) => {
    const { id, status } = req.params;
    const role = await findRoleId({ type: APP.USER_ROLES.BRAND });

    const includeOptions = [
      {
        model: Models.UserRoles,
        where: {
          roleId: role,
        },
        attributes: ["roleId"],
      },
      {
        model: Models.BrandDetails,
        attributes: ["id", "contactPerson"],
        required: true,
      },
    ];

    const brand = await Models.Users.findOne({
      where: {
        id,
      },
      attributes: ["id", "email"],
      include: includeOptions,
    });

    if (!brand) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.APP_ERROR)
      );
    }

    const updateBrandStatus = await Models.BrandDetails.update(
      {
        status,
      },
      {
        where: {
          userId: id,
        },
      }
    );

    sendBrandApproveRejectMail(
      brand.BrandDetail.contactPerson,
      brand.email,
      req.payload.status
    );

    console.log(updateBrandStatus, "updateBrandStatus");

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT
    );
  }),

  getWatchDetail: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const watch = await fetchWatchDetail(id);

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      watch
    );

    // const transferReqeust = await Models.TransferRequests.findOne({
    //   where: {
    //     id: watch.id,
    //     requesterId: req.auth.id,
    //     status: 1,
    //     transferFeesPaid: 0,
    //   },
    // });

    // return res.json(transferReqeust);
  }),
  getTransferRequestDetails: catchAsync(async (req, res, next) => {
    const { requestId } = req.params;

    const request = await getTransferRequestDetails(requestId);

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      request
    );
  }),
};
