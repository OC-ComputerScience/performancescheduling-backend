module.exports = (app) => {
  const availability = require("../controllers/availability.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new availability
  router.post("/", [authenticate], availability.create);
  // Retrieve all availabilitys
  router.get("/", [authenticate], availability.findAll);
  // Retrieve a single availability with id
  router.get("/:id", [authenticate], availability.findById);
  // Update a availability with id
  router.put("/:id", [authenticate], availability.update);
  // Delete a availability with id
  router.delete("/:id", [authenticate], availability.delete);
  // Delete all availability
  router.delete("/", [authenticate], availability.deleteAll);
  // Get all availabilities by userRoleId
  router.get(
    "/userRoleId/:userRoleId",
    [authenticate],
    availability.getByUserRole
  );
  // Get all availabilities by userRoleId and eventId
  router.get(
    "/userRoleId/:userRoleId/eventId/:eventId",
    [authenticate],
    availability.getByUserRoleAndEvent
  );

  app.use("/performanceapi/availability", router);
};
