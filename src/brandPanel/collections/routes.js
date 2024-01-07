const router = require("express").Router();

const { authenticateRole } = require("../../../middleware/passport/index.js");
const controller = require("./controller.js");
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

router.post(
  "/brands/collection",
  [
    authenticateRole(),
    // validator.body(validators.createCollectionValidator.body),
  ],
  controller.createCollection
);

router.get(
  "/brands/collections",
  [authenticateRole(), validator.query(validators.getCollections.query)],
  controller.getCollectionsListing
);

router.delete(
  "/brands/collection",
  [authenticateRole(), validator.query(validators.getCollections.query)],
  controller.deleteCollection
);

router.get(
  "/brands/collection/:id",
  [authenticateRole()],
  controller.getCollection
);

router.put(
  "/brands/collection/:id",
  [authenticateRole(), validator.body(validators.addCollection.body)],
  controller.updateCollection
);

router.delete(
  "/brands/collection/:id",
  [authenticateRole()],
  controller.deleteCollection
);

router.get(
  "/brands/collection/:id/sub-collections",
  [authenticateRole(), validator.query(validators.getCollections.query)],
  controller.getSubCollectionsListing
);

router.get(
  "/brands/collection/sub-collection/:id",
  [authenticateRole()],
  controller.getSubcollection
);

router.post(
  "/brands/collection/sub-collection/:collectionId",
  [
    authenticateRole(),
    // validator.body(validators.createSubCollection.body)
  ],
  controller.createSubCollection
);

router.delete(
  "/brands/collection/sub-collection/:id",
  [authenticateRole()],
  controller.deleteSubCollection
);

router.put(
  "/brands/collection/sub-collection/:id",
  [authenticateRole(), validator.body(validators.updateSubCollection.body)],
  controller.updateSubCollection
);

router.get(
  "/brands/collection/sub-collections/:id/watches",
  [authenticateRole(), validator.query(validators.getWatches.query)],
  controller.getWatchesListing
);

router.get(
  "/brands/collection/sub-collections/:id/watches-export",
  // [authenticateRole()],
  controller.exportWatches
);



// router.post("/user/protected", [authenticateRole()], controller.protected);

module.exports = router;
