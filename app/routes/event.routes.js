module.exports = (app) => {

  const event = require("../controllers/event.controller.js");

  const { authenticate } = require("../authorization/authorization.js");

  var router = require("express").Router();

  // Create a new event
  router.post("/", [authenticate], event.create);
  // Retrieve all events
  router.get("/", [authenticate], event.findAll);
  // Retrieve a single event with id
  router.get("/:id", [authenticate], event.findById);
  // Retrieve all events with date after date
  router.get("/date/:date", [authenticate], event.findDateAndAfter);
  // Update a event with id
  router.put("/:id", [authenticate], event.update);
  // Delete a event with id
  router.delete("/:id", [authenticate], event.delete);
  // Delete all events
  router.delete("/", [authenticate], event.deleteAll);
  // Retrieve student signups for eventId
  router.get(
    "/studentInstrumentSignups/:eventId",
    [authenticate],
    event.getStudentInstrumentSignupsForEventId
  );
  // Retrieve all events within a semester
  router.get(
    "/semesterId/:semesterId",
    [authenticate],
    event.getEventsBySemesterId
  );
  
  router.post("/:id/emailActiveStudents", [authenticate], event.emailActiveStudentsForEvent);
  router.post("/:id/emailActiveInstAccForEvent", [authenticate], event.emailActiveInstAccForEvent);

  router.post("/:id/emailSignedUpStudentsForEvent", [authenticate], event.emailSignedUpStudentsForEvent);
  router.post("/:id/emailAvailInstAccForEvent", [authenticate], event.emailAvailInstAccForEvent);
 
  app.use("/performanceapi/event", router);
};
