module.exports = (app) => {
  const eventSignupPiece = require("../controllers/eventSignupPiece.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new eventSignupPiece
  router.post("/", [authenticate], eventSignupPiece.create);
  // Retrieve all eventSignupPieces
  router.get("/", [authenticate], eventSignupPiece.findAll);
  // Retrieve a single eventSignupPiece with id
  router.get("/:id", [authenticate], eventSignupPiece.findById);
  // Update a eventSignupPiece with id
  router.put("/:id", [authenticate], eventSignupPiece.update);
  // Delete a eventSignupPiece with id
  router.delete("/:id", [authenticate], eventSignupPiece.delete);
  // Delete all eventSignupPieces
  router.delete("/", [authenticate], eventSignupPiece.deleteAll);
  // Get all songs by timeslot
  router.get(
    "/timeslotId/:timeslotId",
    [authenticate],
    eventSignupPiece.getByEventId
  );

  app.use("/performanceapi/eventSignupPiece", router);
};
