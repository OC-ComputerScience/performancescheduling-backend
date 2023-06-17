module.exports = (app) => {
  const piece = require("../controllers/piece.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new piece
  router.post("/", [authenticate], piece.create);
  // Retrieve all pieces
  router.get("/", [authenticate], piece.findAll);
  // Retrieve a single piece with id
  router.get("/:id", [authenticate], piece.findById);
  // Update a piece with id
  router.put("/:id", [authenticate], piece.update);
  // Delete a piece with id
  router.delete("/:id", [authenticate], piece.delete);
  // Delete all pieces
  router.delete("/", [authenticate], piece.deleteAll);
  // Get by composer Id
  router.get("/composer/:composerId", [authenticate], piece.getByComposer);
  // Retrieve all pieces by status
  router.get("/status/:status", [authenticate], piece.findAllByStatus);

  app.use("/performanceapi/piece", router);
};
