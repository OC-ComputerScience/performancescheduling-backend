module.exports = (app) => {
  const studentInstrumentSignup = require("../controllers/studentInstrumentSignup.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new studentInstrumentSignup
  router.post("/", [authenticate], studentInstrumentSignup.create);
  // Retrieve all studentInstrumentSignups
  router.get("/", [authenticate], studentInstrumentSignup.findAll);
  // Retrieve a single studentInstrumentSignup with id
  router.get("/:id", [authenticate], studentInstrumentSignup.findById);
  // Update a studentInstrumentSignup with id
  router.put("/:id", [authenticate], studentInstrumentSignup.update);
  // Delete a studentInstrumentSignup with id
  router.delete("/:id", [authenticate], studentInstrumentSignup.delete);
  // Delete all studentInstrumentSignups
  router.delete("/", [authenticate], studentInstrumentSignup.deleteAll);

  app.use("/performanceapi/studentInstrumentSignup", router);
};