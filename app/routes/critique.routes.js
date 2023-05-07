module.exports = (app) => {
  const critique = require("../controllers/critique.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new critique
  router.post("/", [authenticate], critique.create);
  // Retrieve all critiques
  router.get("/", [authenticate], critique.findAll);
  // Retrieve a single critique with id
  router.get("/:id", [authenticate], critique.findById);
  // Update a critique with id
  router.put("/:id", [authenticate], critique.update);
  // Delete a critique with id
  router.delete("/:id", [authenticate], critique.delete);
  // Delete all critiques
  router.delete("/", [authenticate], critique.deleteAll);
  // get critique by timeslot and faculty
  router.get(
    "/eventSignupId/:eventSignupId/userRoleId/:userRoleId",
    [authenticate],
    critique.getCritiqueByEventSignupAndJuror
  );
  // Retrieve critiques by semester id
  router.get(
    "/semesterId/:semesterId",
    [authenticate],
    critique.getBySemesterId
  );
  // Retrieve critiques by semester id and student id
  router.get(
    "/semesterId/:semesterId/userId/:userId",
    [authenticate],
    critique.getBySemesterIdAndStudentId
  );

  app.use("/performanceapi/critique", router);
};
