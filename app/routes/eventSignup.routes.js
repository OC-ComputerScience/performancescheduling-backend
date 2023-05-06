module.exports = (app) => {
  const eventSignup = require("../controllers/eventSignup.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new eventSignup
  router.post("/", [authenticate], eventSignup.create);
  // Retrieve all eventSignups
  router.get("/", [authenticate], eventSignup.findAll);
  // Retrieve a single eventSignup with id
  router.get("/:id", [authenticate], eventSignup.findById);
  // Retrieve all eventSignups with eventId of id
  router.get("/event/:id", [authenticate], eventSignup.findByEventId);
  // Update a eventSignup with id
  router.put("/:id", [authenticate], eventSignup.update);
  // Delete a eventSignup with id
  router.delete("/:id", [authenticate], eventSignup.delete);
  // Delete all eventSignups
  router.delete("/", [authenticate], eventSignup.deleteAll);

  app.use("/performanceapi/eventSignup", router);
};
