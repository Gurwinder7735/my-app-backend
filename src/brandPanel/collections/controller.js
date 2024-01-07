const Models = require("../../../models");
const jwt = require("jsonwebtoken");
const { sendSuccess } = require("../../../utils/response/responseUtils");
const AppError = require("../../../utils/errorHandlers/appError");
const catchAsync = require("../../../utils/errorHandlers/catchAsync");
const {
  generateRandomWatchId,
  checkIfNameAlreadyExists,
  removeWatches,
} = require("./controllerUtils");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const { Op, Sequelize, Model } = require("sequelize");
const { getPaginatedResults } = require("../../../utils/utils");
const RESPONSE_MSGS = require("../../../utils/response/responseMessages");
const CONSTANTS = require("../../../constants/constants");

module.exports = {
  createCollection: catchAsync(async (req, res, next) => {
    let { name, description, image, subCollections } = req.payload;

    await checkIfNameAlreadyExists(name, Models.Collections);

    const createCollection = await Models.Collections.create({
      name,
      description,
      image,
      userId: req.auth.id,
    });

    const watches = [];

    if (createCollection) {
      subCollections = subCollections.map((e) => ({
        ...e,
        collectionId: createCollection.id,
      }));

      const createSubCollection = await Models.SubCollections.bulkCreate(
        subCollections
      );

      // createSubCollection.forEach((e) => {
      for (j = 0; j < createSubCollection.length; j++) {
        for (i = 0; i < createSubCollection[j].quantity; i++) {
          watches.push({
            subCollectionId: createSubCollection[j].id,
            watchId: await generateRandomWatchId(createCollection.id),
          });
        }
      }
      // });

      const createWatches = await Models.Watches.bulkCreate(watches);

      if (createWatches) {
        return sendSuccess(
          req,
          res,
          STATUS_CODES.SUCCESS,
          STATUS_MSG.SUCCESS.DEFAULT,
          createCollection
        );
      } else {
        return next(new AppError());
      }
    } else {
      return next(new AppError());
    }
  }),
  createSubCollection: catchAsync(async (req, res, next) => {
    let { name, description, image, subCollections } = req.payload;
    const { collectionId } = req.params;

    const watches = [];
    const collection = await Models.Collections.findOne({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }

    // await checkIfNameAlreadyExists(name, Models.SubCollections);

    if (collection) {
      subCollections = subCollections.map((e) => ({
        ...e,
        collectionId: collection.id,
      }));

      const createSubCollection = await Models.SubCollections.bulkCreate(
        subCollections
      );

      // createSubCollection.forEach((e) => {
      for (j = 0; j < createSubCollection.length; j++) {
        for (i = 0; i < createSubCollection[j].quantity; i++) {
          watches.push({
            subCollectionId: createSubCollection[j].id,
            watchId: await generateRandomWatchId(collection.id),
          });
        }
      }
      // });

      const createWatches = await Models.Watches.bulkCreate(watches);

      if (createWatches) {
        return sendSuccess(
          req,
          res,
          STATUS_CODES.SUCCESS,
          STATUS_MSG.SUCCESS.DEFAULT,
          createWatches
        );
      } else {
        return next(new AppError());
      }
    } else {
      return next(new AppError());
    }
  }),

  getCollectionsListing: catchAsync(async (req, res, next) => {
    let { page = 1, limit = 10, keyword = "", status, role } = req.payload;

    const includeOptions = [];

    const where = {
      userId: req.auth.id,
      name: {
        [Op.like]: `%${keyword}%`, // Use the search keyword variable here
      },
    };

    const results = await getPaginatedResults(
      Models.Collections,
      page,
      limit,
      where,
      [
        "id",
        "name",
        "image",
        "description",
        "createdAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM SubCollections WHERE SubCollections.collectionId = Collections.id AND SubCollections.deletedAt IS NULL)"
          ),
          "subcollectionCount",
        ],
      ],
      includeOptions,
      {
        raw: true,
        order: [["id", "DESC"]],
      }
    );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS,
      results
    );
  }),

  getSubCollectionsListing: catchAsync(async (req, res, next) => {
    let { page = 1, limit = 10, keyword = "", status, role } = req.payload;

    const includeOptions = [];

    const where = {
      collectionId: req.params.id,
      name: {
        [Op.like]: `%${keyword}%`, // Use the search keyword variable here
      },
    };

    const results = await getPaginatedResults(
      Models.SubCollections,
      page,
      limit,
      where,
      [
        "id",
        "name",
        "image",
        "color",
        "collectionId",
        "quantity",
        "createdAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM Watches WHERE Watches.subCollectionId = SubCollections.id AND SubCollections.deletedAt IS NULL)"
          ),
          "watchesCount",
        ],
      ],
      includeOptions,
      {
        raw: true,
      },
      {
        order: [["id", "DESC"]],
      }
    );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS,
      results
    );
  }),

  getSubcollection: catchAsync(async (req, res, next) => {
    const subCollection = await Models.SubCollections.findOne({
      where: {
        id: req.params.id,
      },
      attributes: [
        "id",
        "name",
        "image",
        "color",
        "gtin",
        "description",
        "collectionId",
        "material",
        "quantity",
        "createdAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM Watches WHERE Watches.subCollectionId = SubCollections.id AND SubCollections.deletedAt IS NULL)"
          ),
          "watchesCount",
        ],
        [
          Sequelize.literal(
            "(SELECT COUNT(id) FROM Watches WHERE Watches.subCollectionId = SubCollections.id AND SubCollections.deletedAt IS NULL AND STATUS IN(2,3))"
          ),
          "verifiedWatchesCount",
        ],
      ],
    });

    if (!subCollection) {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS,
      subCollection
    );
  }),

  getWatchesListing: catchAsync(async (req, res, next) => {
    let { page = 1, limit = 10, keyword = "", status, role } = req.payload;

    const includeOptions = [
      {
        model: Models.SubCollections,
        include: [
          {
            model: Models.Collections,
            attributes: ["name"],
          },
        ],
        // as: "subCollections",
        // attributes: ["id", "name", "color", "quantity"],
      },
    ];

    const where = {
      subCollectionId: req.params.id,
      status,
      watchId: {
        [Op.like]: `%${keyword}%`, // Use the search keyword variable here
      },
    };

    const results = await getPaginatedResults(
      Models.Watches,
      page,
      limit,
      where,
      [
        "id",
        "watchId",
        "status",
        "subCollectionId",
        "lastUpdated",
        "createdAt",
      ],
      includeOptions,
      {
        raw: false,
        order: [["id", "DESC"]],
      }
    );

    const getUnverifiedCount = Models.Watches.count({
      where: {
        ...where,
        status: 1,
      },
    });
    const getVerifiedCount = Models.Watches.count({
      where: {
        ...where,
        status: 2,
      },
    });
    const getManufacturedCount = Models.Watches.count({
      where: {
        ...where,
        status: 3,
      },
    });

    const [unverifiedCount, verifiedCount, manufacturedCount] =
      await Promise.all([
        getUnverifiedCount,
        getVerifiedCount,
        getManufacturedCount,
      ]);

    results.unverifiedCount = unverifiedCount;
    results.verifiedCount = verifiedCount;
    results.manufacturedCount = manufacturedCount;

    // return res.json({
    //   unverified,
    //   verified,
    //   manufactured,
    // });

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS,
      results
    );
  }),
  exportWatches: catchAsync(async (req, res, next) => {
    const includeOptions = [
      {
        model: Models.SubCollections,
        attributes: ["id", "name", "color", "quantity", "collectionId"],
        include: {
          model: Models.Collections,
        },
      },
    ];

    const where = {
      subCollectionId: req.params.id,
    };

    const results = await Models.Watches.findAll({
      where,
      include: includeOptions,
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "watchId",
        "status",
        "subCollectionId",
        "lastUpdated",
        "createdAt",
      ],
    });

    // const results = await getPaginatedResults(
    //   Models.Watches,
    //   page,
    //   limit,
    //   where,
    //   [
    //     "id",
    //     "watchId",
    //     "status",
    //     "subCollectionId",
    //     "lastUpdated",
    //     "createdAt",
    //   ],
    //   includeOptions,
    //   {
    //     raw: false,
    //     order: [["id", "DESC"]],
    //   }
    // );

    return sendSuccess(
      req,
      res,
      STATUS_CODES.SUCCESS,
      STATUS_MSG.SUCCESS,
      results
    );
  }),

  getCollection: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const collection = await Models.Collections.findOne({
      where: {
        id,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(
              "(SELECT COUNT(*) FROM SubCollections WHERE SubCollections.collectionId = Collections.id AND SubCollections.deletedAt IS NULL)"
            ),
            "subcollectionCount",
          ],
        ],
      },
    });

    if (collection) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.DEFAULT,
        collection
      );
    } else {
      next(new AppError(STATUS_MSG.ERROR.INVALID_ID));
    }
  }),

  updateCollection: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // return res.json(req.payload);
    const success = await Models.Collections.update(req.payload, {
      where: {
        id,
      },
    });

    if (success) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.COLLECTION_UPDATE_SUCCESS
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.INVALID_ID));
    }
  }),
  updateSubCollection: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // return res.json(req.payload);

   const subCollection =  await Models.SubCollections.findOne({
      where: {
         id
      }
   });

   if(!subCollection){
    return next(new AppError(STATUS_MSG.ERROR.INVALID_ID));
   }

   if(Number(req?.body?.quantity) !== Number(subCollection?.quantity)){
      
      let verifiedWatches =  await Models.Watches.count({
         where: {
           subCollectionId: id,
           status: [CONSTANTS.APP.WATCH_STATUS.VERIFIED,CONSTANTS.APP.WATCH_STATUS.SOLD]
         }
       });

       if(verifiedWatches == 0){
            if(Number(req?.body?.quantity) < Number(subCollection?.quantity)){

                const quantityToRemove = Number(subCollection?.quantity) -  Number(req?.body?.quantity)
                await removeWatches(subCollection?.id, quantityToRemove);
                
            }else if(Number(req?.body?.quantity) > subCollection?.quantity ){
          
              const quantityToAdd =  Number(req?.body?.quantity) -  Number(subCollection?.quantity);
          
              const watches = [];
              for (i = 0; i < quantityToAdd; i++) {
                watches.push({
                  subCollectionId: id,
                  watchId: await generateRandomWatchId(subCollection?.collectionId),
                });
              }
          
              await Models.Watches.bulkCreate(watches);
              
            }
       }else{
         delete req.payload.quantity
       }

        
   }




   

    const success = await Models.SubCollections.update(req.payload, {
      where: {
        id,
      },
    });

    if (success) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.UPDATE_SUCCESS
      );
    } else {
      return next(new AppError(STATUS_MSG.ERROR.INVALID_ID));
    }
  }),
  deleteCollection: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const success = await Models.Collections.destroy({
      where: {
        id,
        userId: req.auth.id,
      },
    });

    if (success) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.COLLECTION_DELETE_SUCCESS
      );
    } else {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }
  }),
  deleteSubCollection: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const success = await Models.SubCollections.destroy({
      where: {
        id,
      },
    });

    if (success) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.DELETE_SUCCESS
      );
    } else {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }
  }),
  deleteCollection: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const success = await Models.Collections.destroy({
      where: {
        id,
        userId: req.auth.id,
      },
    });

    if (success) {
      return sendSuccess(
        req,
        res,
        STATUS_CODES.SUCCESS,
        STATUS_MSG.SUCCESS.COLLECTION_DELETE_SUCCESS
      );
    } else {
      return next(
        new AppError(STATUS_MSG.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST)
      );
    }
  }),
};
