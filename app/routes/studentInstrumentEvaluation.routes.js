module.exports = (app) => {
  const studentInstrumentEvaluation = require("../controllers/studentInstrumentEvaluation.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new studentInstrumentEvaluation
  router.post("/", [authenticate], studentInstrumentEvaluation.create);
  // Retrieve all studentInstrumentEvaluations
  router.get("/", [authenticate], studentInstrumentEvaluation.findAll);
  // Retrieve a single studentInstrumentEvaluation with id
  router.get("/:id", [authenticate], studentInstrumentEvaluation.findById);
  // Update a studentInstrumentEvaluation with id
  router.put("/:id", [authenticate], studentInstrumentEvaluation.update);
  // Delete a studentInstrumentEvaluation with id
  router.delete("/:id", [authenticate], studentInstrumentEvaluation.delete);
  // Delete all studentInstrumentEvaluations
  router.delete("/", [authenticate], studentInstrumentEvaluation.deleteAll);

  app.use("/performanceapi/studentInstrumentEvaluation", router);
};
