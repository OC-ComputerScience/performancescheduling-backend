module.exports = (app) => {
  const major = require("../controllers/major.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new major
  router.post("/", [authenticate], major.create);
  // Retrieve all majors
  router.get("/", [authenticate], major.findAll);
  // Retrieve a single major with id
  router.get("/:id", [authenticate], major.findById);
  // Update a major with id
  router.put("/:id", [authenticate], major.update);
  // Delete a major with id
  router.delete("/:id", [authenticate], major.delete);
  // Delete all majors
  router.delete("/", [authenticate], major.deleteAll);

  app.use("/performanceapi/major", router);
};
