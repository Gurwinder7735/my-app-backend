const { sendSuccess } = require("../../../utils/response/responseUtils");
const AppError = require("../../../utils/errorHandlers/appError");
const catchAsync = require("../../../utils/errorHandlers/catchAsync");
const Models = require("../../../models");
const {} = require("../../../utils/utils");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const { generateRandomCodeForWatch, codeExistsInDatabase } = require("./controllerUtils");

module.exports = {

  generateRandomCode: catchAsync(async (req, res, next) => {

   const verificationCode = await generateRandomCodeForWatch();
 
   return sendSuccess(
    req,
    res,
    STATUS_CODES.SUCCESS,
    STATUS_MSG.SUCCESS.DEFAULT,
    {verificationCode}
  );

  }),

  updateVerificationCode: catchAsync(async (req, res, next) => {

    const {verificationCode, watchId} = req.body

   const codeExists = await codeExistsInDatabase(verificationCode);
   
   if(codeExists){
    return next(
      new AppError(STATUS_MSG.ERROR.CODE_ALREADY_EXISTS, STATUS_CODES.BAD_REQUEST)
    );
   }

  await Models.Watches.update({
    verificationCode
   }, {
    where: {
       id: watchId
    }
   });
 
   return sendSuccess(
    req,
    res,
    STATUS_CODES.SUCCESS,
    STATUS_MSG.SUCCESS.DEFAULT,
    {}
  );


  }),

  checkVerificationCode: catchAsync(async (req, res, next) => {

    const {verificationCode} = req.body

   const codeExists = await codeExistsInDatabase(verificationCode);
   
   if(codeExists){
    return next(
      new AppError(STATUS_MSG.ERROR.CODE_ALREADY_EXISTS, STATUS_CODES.BAD_REQUEST)
    );
   }
 
   return sendSuccess(
    req,
    res,
    STATUS_CODES.SUCCESS,
    STATUS_MSG.SUCCESS.DEFAULT,
    {}
  );


  }),


};
