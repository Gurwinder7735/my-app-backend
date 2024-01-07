const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const AppError = require("../../../utils/errorHandlers/appError");
const catchAsync = require("../../../utils/errorHandlers/catchAsync");
const Models = require("../../../models");
const { getPaginatedResults } = require("../../../utils/utils");
const { Op } = require("sequelize");
const { sendSuccess } = require("../../../utils/response/responseUtils");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const { findRoleId } = require("../../common/auth/controllerUtils");
const { APP } = require("../../../constants/constants");

module.exports = {
  getWorkersListing: catchAsync(async (req, res, next) => {
    let { page = 1, limit = 10, keyword = "", status, role } = req.payload;

    role = await findRoleId({ type: role });

    const includeOptions = {
      model: Models.UserRoles,
      where: {
        roleId: role,
      },
      attributes: ["roleId"],
      include: {
        model: Models.Roles,
        attributes: ["roleName"],
      },
    };

    const where = {
      brandId: req.auth.id,
      name: {
        [Op.like]: `%${keyword}%`, // Use the search keyword variable here
      },
    };

    const results = await getPaginatedResults(
      Models.Users,
      page,
      limit,
      where,
      ["id", "email", "name", "firstName", "lastName", "status", "createdAt"],
      includeOptions,
      {
        order: [["id", "DESC"]],
        raw: true,
      }
    );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      results
    );
  }),

  getWorkerDetails: catchAsync(async (req, res, next) => {
    let { id } = req.params;

    const includeOptions = {
      model: Models.UserRoles,
      where: {},
      attributes: ["roleId"],
      include: {
        model: Models.Roles,
        attributes: ["roleName"],
      },
    };

    const where = {
      id,
    };

    const worker = await Models.Users.findOne({
      where,
      attributes: ["id", "email", "name", "firstName", "lastName", "status"],
      include: includeOptions,
      raw: true,
    });

    const allowedRoles = [
      APP.USER_ROLES.FACTORY_WORKER,
      APP.USER_ROLES.SALES_PERSON,
    ];

    if (!worker || !allowedRoles.includes(worker["UserRole.Role.roleName"])) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DEFAULT,
      worker
    );
  }),
  updateWorkerDetails: catchAsync(async (req, res, next) => {
    let { id } = req.params;

    const payload = req.payload;

    payload.name = payload.firstName + " " + payload.lastName;

    const includeOptions = {
      model: Models.UserRoles,
      where: {},
      attributes: ["roleId"],
      include: {
        model: Models.Roles,
        attributes: ["roleName"],
      },
    };

    const where = {
      id,
    };

    const worker = await Models.Users.findOne({
      where,
      attributes: ["id"],
      include: includeOptions,
      raw: true,
    });

    const allowedRoles = [
      APP.USER_ROLES.FACTORY_WORKER,
      APP.USER_ROLES.SALES_PERSON,
    ];

    if (!worker || !allowedRoles.includes(worker["UserRole.Role.roleName"])) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }

    const updateWorker = await Models.Users.update(payload, {
      where: {
        id,
      },
    });

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.UPDATE_SUCCESS
    );
  }),
  deleteWorker: catchAsync(async (req, res, next) => {
    let { id } = req.params;

    const success = await Models.Users.destroy({
      where: {
        id,
      },
    });

    if (!success) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS.DELETE_SUCCESS
    );
  }),
};
