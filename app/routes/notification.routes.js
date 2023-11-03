module.exports = (app) => {
  const notification = require("../controllers/notification.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new notification
  router.post("/", [authenticate], notification.create);
  // Retrieve all notifications
  router.get("/", [authenticate], notification.findAll);
  // Retrieve a single notification with id
  router.get("/:id", [authenticate], notification.findById);
  // Update a notification with id
  router.put("/:id", [authenticate], notification.update);
  // Delete a notification with id
  router.delete("/:id", [authenticate], notification.delete);
  // Delete all notifications
  router.delete("/", [authenticate], notification.deleteAll);

  app.use("/performanceapi/notification", router);
};
