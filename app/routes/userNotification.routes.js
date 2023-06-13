module.exports = (app) => {
  const userNotification = require("../controllers/userNotification.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new userNotification
  router.post("/", [authenticate], userNotification.create);
  // Retrieve all userNotifications
  router.get("/", [authenticate], userNotification.findAll);
  // Retrieve a single userNotification with id
  router.get("/:id", [authenticate], userNotification.findById);
  // Get by userRoleId
  router.get(
    "/userRoleId/:userRoleId",
    [authenticate],
    userNotification.getByUserRoleId
  );
  // Update a userNotification with id
  router.put("/:id", [authenticate], userNotification.update);
  // Delete a userNotification with id
  router.delete("/:id", [authenticate], userNotification.delete);
  // Delete all userNotifications
  router.delete("/", [authenticate], userNotification.deleteAll);

  app.use("/performanceapi/userNotification", router);
};
