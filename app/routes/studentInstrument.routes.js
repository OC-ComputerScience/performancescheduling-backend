module.exports = (app) => {
  const studentInstrument = require("../controllers/studentInstrument.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new studentInstrument
  router.post("/", [authenticate], studentInstrument.create);
  // Retrieve all studentInstruments
  router.get("/", [authenticate], studentInstrument.findAll);
  // Retrieve a single studentInstrument with id
  router.get("/:id", [authenticate], studentInstrument.findById);
  // Update a studentInstrument with id
  router.put("/:id", [authenticate], studentInstrument.update);
  // Delete a studentInstrument with id
  router.delete("/:id", [authenticate], studentInstrument.delete);
  // Delete all studentInstruments
  router.delete("/", [authenticate], studentInstrument.deleteAll);
  // Get by userId
  router.get("/userId/:userId", [authenticate], studentInstrument.getByUserId);
  // Get by StudentInstrumentSIgnups by userId
  router.get(
    "/instrumentSignups/:userRoleId/",
    [authenticate],
    studentInstrument.getStudentInstrumentSignupsByUserRoleId
  );
  // Get by StudentInstrumentSIgnups by faculty
  router.get(
    "/instrumentSignups/faculty/:facultyRoleId/",
    [authenticate],
    studentInstrument.getStudentInstrumentSignupsByFacultyRoleId
  ); // Get by StudentInstrumentSIgnups by userId
  router.get(
    "/instrumentSignups/:userRoleId/",
    [authenticate],
    studentInstrument.getStudentInstrumentSignupsByUserRoleId
  );
  // Get students for instructor id
  router.get(
    "/instructorId/:instructorId",
    [authenticate],
    studentInstrument.getStudentsForInstructorId
  );

  // Get students for accompanist id
  router.get(
    "/accompanistId/:accompanistId",
    [authenticate],
    studentInstrument.getStudentsForAccompanistId
  );


  // Get instruments for student id
  router.get(
    "/studentId/:studentId",
    [authenticate],
    studentInstrument.getStudentInstrumentsForStudentId
  );

    // Disable all students' instruments
    router.put("/", [authenticate], studentInstrument.disableAllStudentsInstruments);

  app.use("/performanceapi/studentInstrument", router);
};
