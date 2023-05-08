module.exports = (app) => {
  const location = require("../controllers/location.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new location
  router.post("/", [authenticate], location.create);
  // Retrieve all locations
  router.get("/", [authenticate], location.findAll);
  // Retrieve a single location with id
  router.get("/:id", [authenticate], location.findById);
  // Update a location with id
  router.put("/:id", [authenticate], location.update);
  // Delete a location with id
  router.delete("/:id", [authenticate], location.delete);
  // Delete all locations
  router.delete("/", [authenticate], location.deleteAll);

  app.use("/performanceapi/location", router);
};
