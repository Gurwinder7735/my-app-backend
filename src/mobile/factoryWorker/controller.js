const db = require("../../../models");
const jwt = require("jsonwebtoken");

const { sendSuccess } = require("../../../utils/response/responseUtils");
const AppError = require("../../../utils/errorHandlers/appError");
const catchAsync = require("../../../utils/errorHandlers/catchAsync");
const Models = require("../../../models");
const {
  encryptPassword,
  comparePassword,
  generateOtp,
  generateRandomToken,
  getPaginatedResults,
  fetchWatchDetail,
} = require("../../../utils/utils");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const RESPONSE_MSGS = require("../../../utils/response/responseMessages");
const { Op } = require("sequelize");
const CONSTANTS = require("../../../constants/constants");
const { APP } = require("../../../constants/constants");
const { getTransferRequestDetails } = require("../user/controllerUtils");

module.exports = {
  getWatchesListing: catchAsync(async (req, res, next) => {
    const { page, limit = 10, keyword = "" } = req.payload;

    const includeOptions = [
      {
        model: Models.SubCollections,
        attributes: [
          "id",
          "name",
          "image",
          "quantity",
          "material",
          "color",
          "gtin",
          "description",
        ],
        include: {
          model: Models.Collections,
          attributes: ["name"],
          required: true,
        },
        required: true,
      },
    ];

    const fieldToCheck = {
      [CONSTANTS.APP.USER_ROLES.FACTORY_WORKER]: "verifiedBy",
      [CONSTANTS.APP.USER_ROLES.SALES_PERSON]: "soldBy",
      [CONSTANTS.APP.USER_ROLES.USER]: "ownerId",
    };

    const where = {
      [fieldToCheck[req.auth.role]]: req.auth.id,
    };

    // const where = {
    //   [req.auth.role == CONSTANTS.APP.USER_ROLES.FACTORY_WORKER
    //     ? "verifiedBy"
    //     : "soldBy"]: req.auth.id,
    // };

    // return res.json(where);
    const data = await getPaginatedResults(
      Models.Watches,
      page,
      limit,
      where,
      {},
      includeOptions,
      { order: [["updatedAt", "DESC"]] }
    );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      RESPONSE_MSGS.STATUS_MSG.SUCCESS.DEFAULT,
      data
    );
  }),

  getWatchDetail: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const watch = await fetchWatchDetail(id);

    watch.dataValues.transferReqeust = null;
    if (req.auth.role == APP.USER_ROLES.USER) {
      const transferReqeust = await Models.TransferRequests.findOne({
        where: {
          watchId: watch.id,
          requesterId: req.auth.id,
          status: {
            [Op.in]: [APP.OWNERSHIP_REQUEST_STATUS.PENDING,APP.OWNERSHIP_REQUEST_STATUS.APPROVED]
          },
          transferFeesPaid: 0,
        },
        attributes: ["id"],
      });

      if (transferReqeust)
        watch.dataValues.transferReqeust = await getTransferRequestDetails(
          transferReqeust?.id
        );
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      RESPONSE_MSGS.STATUS_MSG.SUCCESS.DEFAULT,
      watch
    );

    // return res.json(transferReqeust);
  }),
  updateWatchStatus: catchAsync(async (req, res, next) => {
    const { watchId, status } = req.params;
    const {verificationCode} = req.body

    const includeOptions = [
      {
        model: Models.SubCollections,
        required: true,
        attributes: [
          "id",
          "name",
          "image",
          "quantity",
          "color",
          "material",
          "gtin",
          "description",
        ],
        include: {
          model: Models.Collections,
          attributes: ["id", "name", "userId"],
          required: true,
        },
      },
    ];

    const watch = await Models.Watches.findOne({
      where: {
        [Op.or]: [
          {
            id: watchId,
          },
          {
            watchId: watchId,
          },
        ],
      },
      include: includeOptions,
    });

    if (!watch) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }

    // return res.json(req.auth);

    // console.log(req.auth.brandId);
    // console.log(watch.SubCollection.Collection.userId);

    if (req.auth.brandId !== watch.SubCollection.Collection.userId) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS,
          STATUS_CODES.BAD_REQUEST
        )
      );
    }
    // console.log();
    // console.log();
    // return res.json(watch.SubCollection.Collection.userId);

    if (
      [2, 3].includes(watch.status) &&
      req.auth.role == CONSTANTS.APP.USER_ROLES.FACTORY_WORKER
    ) {
      return next(
        new AppError(
          STATUS_MSG.ERROR.WATCH_ALREADY_SCANNED,
          STATUS_CODES.BAD_REQUEST
        )
      );
    }

    if (req.auth.role == CONSTANTS.APP.USER_ROLES.SALES_PERSON) {
      if (watch.status == 3) {
        return next(
          new AppError(
            STATUS_MSG.ERROR.WATCH_ALREADY_SOLD,
            STATUS_CODES.BAD_REQUEST
          )
        );
      } else if (watch.status == 1) {
        return next(
          new AppError(
            STATUS_MSG.ERROR.WATCH_NOT_MANUFACTURED,
            STATUS_CODES.BAD_REQUEST
          )
        );
      }
    };

    const fieldsToUpdate = {
      status,
      [req.auth.role == CONSTANTS.APP.USER_ROLES.SALES_PERSON
        ? "soldBy"
        : "verifiedBy"]: req.auth.id,
    };

    // Update the verification code of watch if sales person is marking watch as sold
    if(req?.body?.verificationCode){
       fieldsToUpdate.verificationCode = verificationCode
    }

    const updateStatus = await Models.Watches.update(
      fieldsToUpdate,
      {
        where: {
          id: watch?.id,
        },
      }
    );

    if (updateStatus) {
      watch.status = status;
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        RESPONSE_MSGS.STATUS_MSG.SUCCESS.DEFAULT,
        watch
      );
    } else {
      return next(
        new AppError(RESPONSE_MSGS.ERROR.DEFAULT, STATUS_CODES.DEFAULT)
      );
    }
  }),

  protected: catchAsync(async (req, res, next) => {
    console.log("inside protected route");
  }),
};
