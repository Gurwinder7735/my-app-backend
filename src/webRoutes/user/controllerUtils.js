const { Op, Model, Sequelize } = require("sequelize");
const { APP } = require("../../../constants/constants");
const Models = require("../../../models");
const AppError = require("../../../utils/errorHandlers/appError");
const RESPONSE_MSGS = require("../../../utils/response/responseMessages");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const STATUS_CODES = require("../../../utils/response/statusCodes");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FCM = require("fcm-node");
const { getKeyByValue, sendMail } = require("../../../utils/utils");
const CONSTANTS = require("../../../constants/constants");
const serverKey = process.env.FCM_SERVER_KEY; //put your server key here
const fcm = new FCM(serverKey);


module.exports = {
  getWatchDetail: (id) => {
    return new Promise((resolve, reject) => {
      Models.Watches.findOne({
        where: {
          [Op.or]: [
            {
              id,
            },
            {
              watchId: id,
            },
          ],
        },
      })
        .then((watch) => {
          if (watch) {
            resolve(watch);
          } else {
            reject("Invalid watch id");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createOwnershipTransferRequest: (payload) => {
    return new Promise((resolve, reject) => {
      Models.TransferRequests.findOne({
        where: {
          watchId: payload.watchId,
          ownerId: payload.ownerId,
          requesterId: payload.requesterId,
          status: {
            [Op.in]: [
              APP.OWNERSHIP_REQUEST_STATUS.APPROVED,
              APP.OWNERSHIP_REQUEST_STATUS.PENDING,
            ],
          },
          transferFeesPaid: 0,
        },
      })
        .then((request) => {
          if (request) {
            reject(
              new AppError(
                STATUS_MSG.ERROR.ALREADY_CREATED_REQUEST,
                STATUS_CODES.BAD_REQUEST
              )
            );
          } else {
            Models.TransferRequests.create({
              watchId: payload.watchId,
              ownerId: payload.ownerId,
              requesterId: payload.requesterId,
              transferFeeAmount: APP.OWNERSHIP_TRANSFER_FEE,
            })
              .then((result) => {
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getTransferRequestDetails: (id) => {
    return new Promise((resolve, reject) => {
      Models.TransferRequests.findOne({
        where: {
          [Op.or]: [
            {
              id,
            },
            {
              orderId: id,
            },
          ],
        },
        include: [
          {
            model: Models.Users,
            as: "requester",
            attributes: ["id", "name"],
          },
          {
            model: Models.Watches,
            as: "watch",
            attributes: ["id", "ownerId", "watchId"],
            include: [
              {
                model: Models.SubCollections,
                attributes: {
                  exclude: ["deletedAt", "updatedAt", "createdAt"],
                },
                include: [
                  {
                    model: Models.Collections,
                    attributes: [
                      "name",
                      "userId",
                      "id",
                      [
                        Sequelize.literal(
                          "(SELECT brandName FROM BrandDetails WHERE userId= `watch.SubCollection.Collection.userId`)"
                        ),
                        "brandName",
                      ],
                    ],
                    required: true,
                    // include: {
                    //   model: Models.BrandDetails,
                    //   as: "brandDetails",
                    //   attributes: []
                    // },
                  },
                ],
              },
            ],
          },
        ],
      })
        .then((watch) => {
          if (watch) {
            resolve(watch);
          } else {
            reject(
              new AppError(
                STATUS_MSG.ERROR.INVALID_ID,
                STATUS_CODES.BAD_REQUEST
              )
            );
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateTransferRequestStatus: (payload) => {
    return new Promise((resolve, reject) => {
      Models.TransferRequests.update(
        {
          status: payload.status,
        },
        {
          where: {
            id: payload.requestId,
          },
        }
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  rejectOtherTransferRequests: async(payload) => {

    try {


      const requests = await Models.TransferRequests.findAll(
        {
          where: {
            [Op.not]: {
              id: payload.requestId,
            },
            watchId: payload.watchId,
            status: APP.OWNERSHIP_REQUEST_STATUS.PENDING
          },
          raw: true
        }
      )

      await Models.TransferRequests.update(
        {
          status: APP.OWNERSHIP_REQUEST_STATUS.CANCELLED,
        },
        {
          where: {
            [Op.not]: {
              id: payload.requestId,
            },
            watchId: payload.watchId,
            status: APP.OWNERSHIP_REQUEST_STATUS.PENDING
          },
        }
      )

 
      requests.forEach((request) => {
        console.log('SEND NOTIFICATION REQUEST CANCELLED TO OTHER USERS.')
        module.exports.sendNotificatioinToRequester(request, 1, APP.OWNERSHIP_REQUEST_STATUS.CANCELLED);
      })

      
      
    } catch (err) {
       throw err
    }
    // return new Promise((resolve, reject) => {
    //   Models.TransferRequests.update(
    //     {
    //       status: APP.OWNERSHIP_REQUEST_STATUS.REJECTED,
    //     },
    //     {
    //       where: {
    //         [Op.not]: {
    //           id: payload.requestId,
    //         },
    //         watchId: payload.watchId,
    //       },
    //     }
    //   )
    //     .then((res) => {
    //       resolve(res);
    //     })
    //     .catch((err) => {
    //       reject(err);
    //     });
    // });
  },
  rejectOtherApprovedTransferRequests: async(payload) => {

    try {


      const requests = await Models.TransferRequests.findAll(
        {
          where: {
            [Op.not]: {
              id: payload.requestId,
            },
            watchId: payload.watchId,
            status: APP.OWNERSHIP_REQUEST_STATUS.APPROVED,
            transferFeesPaid: 0
          },
          raw: true
        }
      )

      console.log("REquests other >>>>>>>>>>", requests);

      await Models.TransferRequests.update(
        {
          status: APP.OWNERSHIP_REQUEST_STATUS.CANCELLED,
        },
        {
          where: {
            [Op.not]: {
              id: payload.requestId,
            },
            watchId: payload.watchId,
            status: APP.OWNERSHIP_REQUEST_STATUS.APPROVED
          },
        }
      )

 
      requests.forEach((request) => {
        console.log('SEND NOTIFICATION REQUEST CANCELLED TO OTHER USERS.')
        module.exports.sendNotificatioinToRequester(request, 1, APP.OWNERSHIP_REQUEST_STATUS.CANCELLED);
      })

      
      
    } catch (err) {
       throw err
    }
    // return new Promise((resolve, reject) => {
    //   Models.TransferRequests.update(
    //     {
    //       status: APP.OWNERSHIP_REQUEST_STATUS.REJECTED,
    //     },
    //     {
    //       where: {
    //         [Op.not]: {
    //           id: payload.requestId,
    //         },
    //         watchId: payload.watchId,
    //       },
    //     }
    //   )
    //     .then((res) => {
    //       resolve(res);
    //     })
    //     .catch((err) => {
    //       reject(err);
    //     });
    // });
  },

  makePayment: (watchId, orderId, paymentType) => {
    return new Promise((resolve, reject) => {
      stripe.paymentLinks
        .create({
          line_items: [
            {
              price: "price_1Nk2OnCKurQ9XeC3XKUzxU8p",
              quantity: 1,
            },
          ],
          after_completion: {
            type: "redirect",
            redirect: {
              url: `${process.env.FRONT_END_URL}/payment-success/${watchId}/${orderId}`,
            },
          },
          payment_method_types: [paymentType],
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
      // stripe.paymentIntents
      //   .create({
      //     amount: 2000,
      //     currency: "inr",
      //     payment_method_types: ["card"],
      //     description: "kfjdskfj",
      //     shipping: {
      //       name: "John Doe", // Replace with the actual customer name
      //       address: {
      //         line1: "123 Main Street", // Replace with the actual address details
      //         city: "City Name",
      //         state: "State Name",
      //         postal_code: "Postal Code",
      //         country: "IN", // Use the ISO country code for India (IN)
      //       },
      //     },
      //   })
      //   .then((res) => {
      //     resolve(res.client_secret);
      //   })
      //   .catch((err) => {
      //     reject(err);
      //   });
      // res.send({
      //   clientSecret: paymentIntent.client_secret,
      // });
    });
  },

  updateWatchOwner: async ({ watchId, newOwnerId }) => {
    return new Promise((resolve, reject) => {
      const updateWatch = Models.Watches.update(
        {
          ownerId: newOwnerId,
        },
        {
          where: {
            id: watchId,
          },
        }
      );

      const addWatchOwner = Models.WatchOwners.create({
        userId: newOwnerId,
        watchId: watchId,
      });

      Promise.all([updateWatch, addWatchOwner])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  },

  findBrandDetailByWatchId:  (watchId) => {
    return new Promise((resolve, reject) => {
       
      console.log(watchId,"watchId >>>>>>>");
        Models.Watches.findOne({
        where: {
          id: watchId
        },
        attributes:  [
          [
          Sequelize.literal(
            "(SELECT email FROM Users WHERE Users.id = (SELECT userId FROM Collections WHERE Collections.id = (SELECT collectionId FROM SubCollections WHERE Watches.subCollectionId= SubCollections.id)))"
          ),"email"],
          [
            Sequelize.literal(
              "(SELECT brandName FROM BrandDetails WHERE userId= (SELECT userId FROM Collections WHERE Collections.id = (SELECT collectionId FROM SubCollections WHERE Watches.subCollectionId= SubCollections.id)) )"
            ),"brandName"],
        ],
        raw: true
      }).then((result) => {
            resolve(result)
      }).catch(err => {
         reject(err)
      })


    });
  },
  

  sendOwnershipClaimedMailToBrand: async(watch, owner) => {

    try {
      
      const brand  = await module.exports.findBrandDetailByWatchId(watch?.id);

      console.log(brand,"brand>>>")
      console.log(watch,"watch>>>")
      
      if(brand.email){

        console.log("sending email................................")
          await sendMail({
             email: brand.email,
             subject: "Watch Ownership Claim",
             templateName: "ownership-claim-brand",
             parameters: {
               brandName: brand.brandName,
               watchModel: watch.SubCollection.name,
               watchId: watch?.watchId,
               ownerName: owner.name
             }
          })
          console.log("mail sent................................")

      }else{
         console.log("Unable to get brand details....")
      }

    } catch (err) {
       throw err
    
    }
    

    
  },
  sendOwnershipTransferMailToBrand: async(request) => {

    try {
      
      const getBrand  =  module.exports.findBrandDetailByWatchId(request.watchId);

      const getNewOwner =  module.exports.getUserDetail({
        id: request?.requesterId,
        attributes: ["id", "name",],
      });

      const getLastOwner =  module.exports.getUserDetail({
        id: request?.ownerId,
        attributes: ["id", "name",],
      });

      const [newOwner, lastOwner, brand] = await Promise.all([getNewOwner, getLastOwner, getBrand])
      
      if(brand.email){

        console.log("sending email................................")
          await sendMail({
             email: brand.email,
             subject: "Watch Ownership Transfer",
             templateName: "ownership-transfer-brand",
             parameters: {
               brandName: brand.brandName,
               watchModel: request.watch.SubCollection.name,
               watchId: request.watch.watchId,
               newOwner: newOwner.name,
               lastOwner: lastOwner.name
             }
          })
          console.log("mail sent................................")

      }else{
         console.log("Unable to get brand details....")
      }

    } catch (err) {
       throw err
    
    }
    

    
  },

  getNotifications: (userId) => {
    return new Promise((resolve, reject) => {
      Models.Notifications.findAll({
        where: {
          receiverId: userId,
        },
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  },

  sendPushNotification: async (payload) => {
    try {
      console.log(payload, "payload");

      let notification = await module.exports.addNotificationToDb({
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        requestId: payload.requestId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
      });

      notification = notification.toJSON()

      const user = await module.exports.getUserDetail({
        id: payload?.receiverId,
        attributes: ["id", "deviceToken", "firstName"],
      });

      notification  =  {
        ...notification,
        body : notification?.message
      }

      console.log(notification,"notification>>>>>>>>>>>");
      

      var message = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: user?.deviceToken,
        // to: "cRW889CWS5m3i6EFPm8pBX:APA91bGQmtvu03Fdjpj211oES3HF2PuqgM21jdUWk_OlkYh8NjZ7Ld20EEMQPtYYH0HfJxADRvf3Vetcj2mJdt7XF3-dRHGg1ifcrcfq85Gcgqz-6eZUNSayTZbPqFE1ogkpo8jUlyQL",
        collapse_key: "your_collapse_key",

        notification,
        // notification: {
        //   title: payload.title,
        //   body: "Body of your push notification",
        // },

        data: notification,
      };

      fcm.send(message, function (err, response) {
        if (err) {
          console.log("Failed to send push notification!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
    } catch (err) {
      throw err;
    }
    // this.addNotificationToDb({});
  },

  getUserDetail: (payload) => {
    return new Promise((resolve, reject) => {
      Models.Users.findOne({
        where: {
          id: payload.id,
        },
        attributes: payload.attributes,
      })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => reject(err));
    });
  },

  addNotificationToDb: ({
    senderId,
    receiverId,
    requestId,
    type,
    title,
    message,
  }) => {
    return new Promise((resolve, reject) => {
      Models.Notifications.create({
        senderId,
        receiverId,
        requestId,
        type,
        title,
        message,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },

  sendNotificatioinToOwner: async (payload, type,status) => {
    try {
      await module.exports.sendPushNotification({
        senderId: payload?.requesterId,
        receiverId: payload?.ownerId,
        requestId: payload?.id,
        type: status || 1,
        title: "Transfer Ownership",
        message: status == CONSTANTS.APP.OWNERSHIP_REQUEST_STATUS.CANCELLED ? "Transfer request has been cancelled." :"Tap to see the transfer ownership request.",
      });
    } catch (err) {
      throw err;
    }
    // this.addNotificationToDb({});
  },

  sendNotificatioinToRequester: async (payload, type, status) => {
    try {
      await module.exports.sendPushNotification({
        senderId: payload?.ownerId,
        receiverId: payload?.requesterId,
        requestId: payload?.id,
        type: status || 1,
        title: "Transfer Ownership",
        message: `Your request has been ${getKeyByValue(
          APP.OWNERSHIP_REQUEST_STATUS,
          status
        ).toLowerCase()}.`,
      });
    } catch (err) {
      throw err;
    }
  },
  makePaymentLinkForRequest: (request) => {
    try {
      return `${process.env.FRONT_END_URL}/transfer-ownership-payment/${request?.id}/${request?.watchId}`;
    } catch (err) {
      throw err;
    }
  },

  
  
};
