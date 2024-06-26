module.exports = (app) => {
  const studentInstrumentSignup = require("../controllers/studentInstrumentSignup.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();
  // Retrive All StudentInstrumentSignups with extra Data
  router.get("/allData", [authenticate], studentInstrumentSignup.findAllWithAllData);
  // Retrieve a single studentInstrumentSignup with id with all data
  router.get("/allData/:id", [authenticate], studentInstrumentSignup.findByIdWithAllData);
  // Retrieve a single studentInstrumentSignup with id with all data
  router.get("/eventSignup/:id", [authenticate], studentInstrumentSignup.findAllbySignUpIdAllData);
  // Create a new studentInstrumentSignup
  router.post("/", [authenticate], studentInstrumentSignup.create);
  // Retrieve all studentInstrumentSignups
  router.get("/", [authenticate], studentInstrumentSignup.findAll);
  // Retrieve a single studentInstrumentSignup with id
  router.get("/:id", [authenticate], studentInstrumentSignup.findById);
  // Retrieve a single studentInstrumentSignup with id with all data
    router.get("/:id/allData", [authenticate], studentInstrumentSignup.findByIdWithAllData);
  // Update a studentInstrumentSignup with id
  router.put("/:id", [authenticate], studentInstrumentSignup.update);
  // Delete a studentInstrumentSignup with id
  router.delete("/:id", [authenticate], studentInstrumentSignup.delete);
  // Delete all studentInstrumentSignups
  router.delete("/", [authenticate], studentInstrumentSignup.deleteAll);
  // Get by userRoleId
  router.get("/userRoleId/:userRoleId", [authenticate], studentInstrumentSignup.getByUserRoleId);

  app.use("/performanceapi/studentInstrumentSignup", router);
};