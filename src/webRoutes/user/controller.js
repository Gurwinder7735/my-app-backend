const { sendSuccess } = require("../../../utils/response/responseUtils");
const AppError = require("../../../utils/errorHandlers/appError");
const catchAsync = require("../../../utils/errorHandlers/catchAsync");
const Models = require("../../../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");

const { Op, Model, Sequelize } = require("sequelize");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const RESPONSE_MSGS = require("../../../utils/response/responseMessages");
const {
  getWatchDetail,
  createOwnershipTransferRequest,
  sendNotificatioinToOwner,
  getTransferRequestDetails,
  updateTransferRequestStatus,
  rejectOtherTransferRequests,
  rejectOtherApprovedTransferRequests,
  sendNotificatioinToRequester,
  makePayment,
  updateWatchOwner,
  makePaymentLinkForRequest,
  sendOwnershipClaimedMailToBrand,
  findBrandDetailByWatchId,
  sendOwnershipTransferMailToBrand,
} = require("./controllerUtils");
const {
  fetchWatchDetail,
  getPaginatedResults,
  getKeyByValue,
  getWatchIdFromReceipt,
} = require("../../../utils/utils");
const { APP } = require("../../../constants/constants");
const CONSTANTS = require("../../../constants/constants");

module.exports = {
  testController: catchAsync(async (req, res, next) => {   
    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      RESPONSE_MSGS.STATUS_MSG.SUCCESS.CLAIM_OWNERSHIP_SUCCESS,
      {
        user: "Hello from test user"
      }
    );
  }),
  // transferOwnershipRequestDetails: catchAsync(async (req, res, next) => {
  //   const requestDetails = await getTransferRequestDetails(
  //     req.params.requestId
  //   );


  //   requestDetails.dataValues.paymentLink =
  //     makePaymentLinkForRequest(requestDetails);

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     RESPONSE_MSGS.STATUS_MSG.SUCCESS.DEFAULT,
  //     requestDetails
  //   );
    
  // }),
  // transferOwnershipRequest: catchAsync(async (req, res, next) => {
  //   const watch = await fetchWatchDetail(req.params.watchId);

  //   if (watch.status != APP.WATCH_STATUS.SOLD) {
  //     return next(
  //       new AppError(STATUS_MSG.ERROR.WATCH_NOT_SOLD, STATUS_CODES.BAD_REQUEST)
  //     );
  //   }

  //   if (!watch?.owner) {
  //     return next(new AppError("This watch has no owner."));
  //   }

  //   if (req?.auth?.id == watch?.owner?.id) {
  //     return next(
  //       new AppError(
  //         STATUS_MSG.ERROR.ALREADY_OWNS_WATCH,
  //         STATUS_CODES.BAD_REQUEST
  //       )
  //     );
  //   }

  //   const transferRequest = await createOwnershipTransferRequest({
  //     watchId: watch?.id,
  //     ownerId: watch?.owner?.id,
  //     requesterId: req?.auth?.id,
  //     transferFeeAmount: APP.OWNERSHIP_TRANSFER_FEE,
  //   });
  //   // const transferRequest = {
  //   //   status: 1,
  //   //   transferFeesPaid: 0,
  //   //   transactionId: "",
  //   //   orderId: "",
  //   //   id: 30,
  //   //   watchId: 4177,
  //   //   ownerId: 248,
  //   //   requesterId: 249,
  //   //   transferFeeAmount: 5,
  //   //   updatedAt: "2023-07-26T10:33:47.109Z",
  //   //   createdAt: "2023-07-26T10:33:47.109Z",
  //   // };

  //   // SEND PUSH NOTIFICATION TO WATCH OWNER
  //   await sendNotificatioinToOwner(transferRequest);

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     RESPONSE_MSGS.STATUS_MSG.SUCCESS
  //       .OWNERSHIP_TRANSFER_REQUEST_CREATE_SUCCESS,
  //     transferRequest
  //   );
  // }),

  // approveRejectTransferRequest: catchAsync(async (req, res, next) => {
  //   let msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_REJECTED;
  //   const requestDetails = await getTransferRequestDetails(
  //     req.params.requestId
  //   );

  //   if (req.params.status == 4) {
  //     if (req?.auth?.id != requestDetails.requesterId) {
  //       return next(new AppError(STATUS_MSG.ERROR.REQUEST_BELONGS_OTHER_USER));
  //     }
  //     msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_CANCELLED_SUCCESS;
  //   } else {
  //     if (req?.auth?.id !== requestDetails?.watch?.ownerId) {
  //       return next(new AppError(STATUS_MSG.ERROR.NOT_OWNER));
  //     }
  //   }

  //   if (requestDetails?.status == req.params.status) {
  //     return next(
  //       new AppError(
  //         `This request is already ${getKeyByValue(
  //           APP.OWNERSHIP_REQUEST_STATUS,
  //           req.params.status
  //         )}`,
  //         STATUS_CODES.BAD_REQUEST
  //       )
  //     );
  //   }

  //   await updateTransferRequestStatus(req.params);

  //   if (req.params.status == 2) {

  //     console.log("reject other requests............")
  //     msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_APPROVED_SUCCESS;
  //     await rejectOtherTransferRequests({
  //       ...req.params,
  //       watchId: requestDetails.watchId,
  //     });
  //   }

  //   // SEND NOTIFICATION TO THE REQUESTER TO PAY THE TRANSFER FEES
  //   if (req.params.status != 4)
  //     sendNotificatioinToRequester(requestDetails, 1, req.params.status);

  //   if (req.params.status == CONSTANTS.APP.OWNERSHIP_REQUEST_STATUS.CANCELLED)
  //     sendNotificatioinToOwner(requestDetails, 1, req.params.status);

  //   return sendSuccess(req, res, STATUS_CODES.SUCCESS, msg);
  // }),

  // makeTransferOwnershipPayment: catchAsync(async (req, res, next) => {
  //   // return res.send(baseUrl);
  //   const request = await getTransferRequestDetails(req.params.requestId);

  //   // if (request.requesterId != req?.auth?.id) {
  //   //   return next(
  //   //     new AppError(STATUS_MSG.ERROR.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST)
  //   //   );
  //   // }

  //   if (request?.status == APP.OWNERSHIP_REQUEST_STATUS.CANCELLED) {
  //     return next(
  //       new AppError(
  //         STATUS_MSG.ERROR.REQUEST_REJECTED,
  //         STATUS_CODES.BAD_REQUEST
  //       )
  //     );
  //   }

  //   if (request?.status != APP.OWNERSHIP_REQUEST_STATUS.APPROVED) {
  //     return next(
  //       new AppError(
  //         STATUS_MSG.ERROR.REQUEST_NOT_APPROVED,
  //         STATUS_CODES.BAD_REQUEST
  //       )
  //     );
  //   }

  //   if (request?.transferFeesPaid) {
  //     return next(
  //       new AppError(
  //         STATUS_MSG.ERROR.TRANSFER_FEES_ALREADY_PAID,
  //         STATUS_CODES.BAD_REQUEST
  //       )
  //     );
  //   }

  //   console.log();

  //   const orderId = "o" + uuidv4();
  //   const payment = await makePayment(
  //     request?.watchId,
  //     orderId,
  //     req.params.type
  //   );

  //   await Models.TransferRequests.update(
  //     {
  //       orderId,
  //     },
  //     {
  //       where: {
  //         id: request?.id,
  //       },
  //     }
  //   );

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     STATUS_MSG.SUCCESS.DEFAULT,
  //     { link: payment.url }
  //   );

  //   // let msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_REJECTED;
  //   // const requestDetails = await getTransferRequestDetails(
  //   //   req.params.requestId
  //   // );
  //   // if (requestDetails?.ownerId !== requestDetails?.watch?.ownerId) {
  //   //   return next(new AppError(STATUS_MSG.ERROR.NOT_OWNER));
  //   // }
  //   // await updateTransferRequestStatus(req.params);
  //   // if (req.params.status == 2) {
  //   //   msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_APPROVED_SUCCESS;
  //   //   rejectOtherTransferRequests({
  //   //     ...req.params,
  //   //     watchId: requestDetails.watchId,
  //   //   });
  //   // }
  //   // // SEND NOTIFICATION TO THE REQUESTER TO PAY THE TRANSFER FEES
  //   // sendNotificatioinToRequester();
  //   // return sendSuccess(req, res, STATUS_CODES.SUCCESS, msg);
  // }),
  // paymentSuccess: catchAsync(async (req, res, next) => {
  //   const request = await getTransferRequestDetails(req.params.orderId);

  //   if (!request) {
  //     return next(
  //       new AppError(STATUS_MSG.ERROR.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST)
  //     );
  //   }


  //   // console.log(request,"request>>>>>>>>>>>>>>>>>>>>>>>>")
  //   // return
  //   // return res.json(request);

  //   if (request.transferFeesPaid == 1) {
  //     return sendSuccess(
  //       req,
  //       res,
  //       STATUS_CODES.SUCCESS,
  //       STATUS_MSG.ERROR.TRANSFER_FEES_ALREADY_PAID
  //     );
  //   }

  //    console.log('Rejecting other requests ');
  //   await rejectOtherApprovedTransferRequests({
  //     watchId: request?.watchId,
  //     requestId: request?.id,
  //   })

  //   await Models.TransferRequests.update(
  //     {
  //       transferFeesPaid: 1,
  //     },
  //     {
  //       where: {
  //         orderId: req.params.orderId,
  //       },
  //     }
  //   );

  //   // await Models.Watches.update(
  //   //   {
  //   //     ownerId: request?.requesterId,
  //   //   },
  //   //   {
  //   //     where: {
  //   //       id: request?.watchId,
  //   //     },
  //   //   }
  //   // );

  //   // await Models.WatchOwners.create({
  //   //   userId: request?.requesterId,
  //   //   watchId: request?.watchId,
  //   // });

  //   await updateWatchOwner({
  //     watchId: request?.watchId,
  //     newOwnerId: request?.requesterId,
  //   });

  //    sendOwnershipTransferMailToBrand(request)

   

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     STATUS_MSG.SUCCESS.PAYMENT_STATUS_UPDATE
  //   );

  //   // return sendSuccess(
  //   //   req,
  //   //   res,
  //   //   STATUS_CODES.SUCCESS,
  //   //   STATUS_MSG.SUCCESS.DEFAULT,
  //   //   { clientSecret: payment }
  //   // );

  //   // let msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_REJECTED;
  //   // const requestDetails = await getTransferRequestDetails(
  //   //   req.params.requestId
  //   // );
  //   // if (requestDetails?.ownerId !== requestDetails?.watch?.ownerId) {
  //   //   return next(new AppError(STATUS_MSG.ERROR.NOT_OWNER));
  //   // }
  //   // await updateTransferRequestStatus(req.params);
  //   // if (req.params.status == 2) {
  //   //   msg = RESPONSE_MSGS.STATUS_MSG.SUCCESS.REQUEST_APPROVED_SUCCESS;
  //   //   rejectOtherTransferRequests({
  //   //     ...req.params,
  //   //     watchId: requestDetails.watchId,
  //   //   });
  //   // }
  //   // // SEND NOTIFICATION TO THE REQUESTER TO PAY THE TRANSFER FEES
  //   // sendNotificatioinToRequester();
  //   // return sendSuccess(req, res, STATUS_CODES.SUCCESS, msg);
  // }),
  // getNotificationsListing: catchAsync(async (req, res, next) => {
  //   const { page, limit = 10, keyword = "" } = req.payload;

  //   const includeOptions = [
  //     {
  //       model: Models.Users,
  //       as: "sender",
  //       required: true,
  //       attributes: ["id", "name"],
  //     },
  //     {
  //       model: Models.Users,
  //       as: "receiver",
  //       required: true,
  //       attributes: ["id", "name"],
  //     },
  //     {
  //       model: Models.TransferRequests,
  //       as: "request",
  //       attributes: ["id", "requesterId", "ownerId", "watchId","status","transferFeesPaid"],
  //     },
  //   ];

  //   const where = {
  //     receiverId: req?.auth?.id,
  //   };

  //   const data = await getPaginatedResults(
  //     Models.Notifications,
  //     page,
  //     limit,
  //     where,
  //     {},
  //     includeOptions,
  //     { order: [["id", "DESC"]] }
  //   );

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     STATUS_MSG.SUCCESS.DEFAULT,
  //     data
  //   );
  // }),
  // updateNotificationStatus: catchAsync(async (req, res, next) => {
  //   const notification = await Models.Notifications.findOne({
  //     where: {
  //       id: req.params.id,
  //     },
  //   });

  //   if (!notification) {
  //     return next(
  //       new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
  //     );
  //   }

  //   await Models.Notifications.update(
  //     {
  //       isRead: req.params.status,
  //     },
  //     {
  //       where: {
  //         id: req.params.id,
  //       },
  //     }
  //   );

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     STATUS_MSG.SUCCESS.DEFAULT
  //   );
  // }),

  // getUserProfile: catchAsync(async (req, res, next) => {
  //   const { id } = req.auth;

  //   const user = await Models.Users.findOne({
  //     where: {
  //       id,
  //     },
  //     attributes: ["id","name", "image","email","nameVisibility","imageVisibility"],
  //     raw: true
  //   });

  //   if (!user) {
  //     return next(
  //       new AppError(STATUS_MSG.ERROR.DEFAULT, STATUS_CODES.APP_ERROR)
  //     );
  //   }

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     STATUS_MSG.SUCCESS.DEFAULT,
  //     {
  //       ...user,
  //       role: APP.USER_ROLES.USER
  //     }
  //   );

  // }),

  // updateUserProfile: catchAsync(async (req, res, next) => {

  //   const { id } = req.auth;
    

  //   const user = await Models.Users.findOne({
  //     where: {
  //       id,
  //     },
  //     attributes: ["id"]
  //   });

  //   if (!user) {
  //     return next(
  //       new AppError(STATUS_MSG.ERROR.DEFAULT, STATUS_CODES.APP_ERROR)
  //     );
  //   };

  //   const updateUser = await Models.Users.update({
  //     ...req.body
  //   },{
  //     where: {
  //        id
  //     }
  //   });


  //   const findUser = await Models.Users.findOne({
  //     where: {
  //       id,
  //     },
  //     attributes: ["id","name", "image","email","nameVisibility","imageVisibility"],
  //     raw: true
  //   });

  //   return sendSuccess(
  //     req,
  //     res,
  //     STATUS_CODES.SUCCESS,
  //     STATUS_MSG.SUCCESS.DEFAULT,
  //     {...findUser,    role: APP.USER_ROLES.USER}
  //   );

  // }),

  // testRoute: catchAsync(async (req, res, next) => {
  

  //   // const result = await findBrandDetailByWatchId(6)

  //   // return res.json(result)
    
  //   const request = await getTransferRequestDetails(334);
  //   console.log(request.watch.watchId,"request.watch.watchId")
  //   console.log(request.watch.SubCollection.name,"request.watch.SubCollection.name")
  //    return res.json(request)

    
  // }),
};
