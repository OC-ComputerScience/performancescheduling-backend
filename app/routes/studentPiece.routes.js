module.exports = (app) => {
  const studentPiece = require("../controllers/studentPiece.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new studentPiece
  router.post("/", [authenticate], studentPiece.create);
  // Retrieve all studentPieces
  router.get("/", [authenticate], studentPiece.findAll);
  // Retrieve a single studentPiece with id
  router.get("/:id", [authenticate], studentPiece.findById);
  // Update a studentPiece with id
  router.put("/:id", [authenticate], studentPiece.update);
  // Delete a studentPiece with id
  router.delete("/:id", [authenticate], studentPiece.delete);
  // Delete all studentPieces
  router.delete("/", [authenticate], studentPiece.deleteAll);
  // Get all studentPiece by semester for userId
  router.get(
    "/userId/:userId",
    [authenticate],
    studentPiece.getStudentRepertoire
  );
  router.get(
    "/semesters/userId/:userId",
    [authenticate],
    studentPiece.getSemesterStudentRepertoire
  );

  app.use("/performanceapi/studentPiece", router);
};
