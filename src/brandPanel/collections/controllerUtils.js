const Models = require("../../../models");
const uuid = require("uuid4");
const { STATUS_MSG } = require("../../../utils/response/responseMessages");
const { boolean } = require("joi");

module.exports = {
  generateRandomWatchId: async (collectionId) => {
    let collection = await Models.Collections.findOne({
      where: {
        id: collectionId,
      },
      attributes: ["name"],
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    let stringWithoutSpaces = collection?.name?.replace(/\s/g, '');

    let prefix = stringWithoutSpaces?.slice(0, 3)?.toUpperCase();

    let randomId = uuid().replace(/-/g, "").substring(0, 16).toUpperCase();
    randomId = prefix + randomId.substring(3);
    // return randomId;
    return randomId.replace(/0/g, "O");
  },

  checkIfNameAlreadyExists: (name, Model, key = "name") => {
    return new Promise((resolve, reject) => {
      Model.count({
        where: {
          [key]: name,
        },
      })
        .then((res) => {
          if (Boolean(res)) reject(STATUS_MSG.ERROR.NAME_ALREADY_EXISTS);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  removeWatches: (subCollectionId, quantity) => {
    return new Promise((resolve, reject) => {
         Models.Watches.destroy({
           where: {
            subCollectionId
           },
           limit :quantity
         }).then((res) => {
            resolve(res)
         }).catch((err) => {
            reject(err)
         })
    });
  },


};
