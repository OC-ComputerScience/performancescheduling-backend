module.exports = (app) => {
  const eventType = require("../controllers/eventType.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new eventType
  router.post("/", [authenticate], eventType.create);
  // Retrieve all eventTypes
  router.get("/", [authenticate], eventType.findAll);
  // Retrieve a single eventType with id
  router.get("/:id", [authenticate], eventType.findById);
  // Update a eventType with id
  router.put("/:id", [authenticate], eventType.update);
  // Delete a eventType with id
  router.delete("/:id", [authenticate], eventType.delete);
  // Delete all eventTypes
  router.delete("/", [authenticate], eventType.deleteAll);

  app.use("/performanceapi/eventType", router);
};
