module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new user
  router.post("/", user.create);
  // Retrieve all users
  router.get("/", [authenticate], user.findAll);
  // Retrieve a single user with id
  router.get("/:id", [authenticate], user.findById);
  // Update a user with id
  router.put("/:id", [authenticate], user.update);
  // Disable a user with id
  router.put("/disable/:id", [authenticate], user.disable);
  // Enable a user with id
  router.put("/enable/:id", [authenticate], user.enable);
  // Delete a user with id
  router.delete("/:id", [authenticate], user.delete);
  // Delete all users
  router.delete("/", [authenticate], user.deleteAll);
  // Get all users and attached roles
  router.get("/all/roles", [authenticate], user.getAllWithRoles);
  // Get all users and attached roles
  router.get(
    "/all/roles/studentInstruments",
    [authenticate],
    user.getAllWithRolesAndStudentInstrumentData
  );

  app.use("/performanceapi/user", router);
};
