const db = require("../models");
const { Op } = require("sequelize");
const StudentInstrumentEvaluation = db.studentInstrumentEvaluation;

// Create and Save a new studentInstrumentEvaluation
exports.create = (req, res) => {
  // Validate request
  if (!req.body.semesterId) {
    res.status(400).send({
      message: "semesterId cannot be empty!",
    });
    return;
  } else if (!req.body.studentInstrumentId) {
    res.status(400).send({
      message: "studentInstrumentId cannot be empty!",
    });
    return;
  } else if (!req.body.instructorRoleId) {
    res.status(400).send({
      message: "instructorRoleId cannot be empty!",
    });
    return;
  } else if (!req.body.type) {
    res.status(400).send({
      message: "type cannot be empty!",
    });
    return;
  } else if (!req.body.courseName) {
    res.status(400).send({
      message: "courseName cannot be empty!",
    });
    return;
  } else if (!req.body.comments) {
    res.status(400).send({
      message: "comments cannot be empty!",
    });
    return;
  }

  const studentInstrumentEvaluation = {
    semesterId: req.body.semesterId,
    studentInstrumentId: req.body.studentInstrumentId,
    instructorRoleId: req.body.instructorRoleId,
    type: req.body.type,
    courseName: req.body.courseName,
    beginningGreatestStrengths: req.body.beginningGreatestStrengths,
    beginningTargetedImprovement: req.body.beginningTargetedImprovement,
    beginningRecitalHearingDates: req.body.beginningRecitalHearingDates,
    beginningPerformanceLevelGoal: req.body.beginningPerformanceLevelGoal,
    midtermAttendance: req.body.midtermAttendance,
    midtermPreparation: req.body.midtermPreparation,
    midtermGoalProgress: req.body.midtermGoalProgress,
    midtermAttitude: req.body.midtermAttitude,
    midtermGrade: req.body.midtermGrade,
    finalAttendance: req.body.finalAttendance,
    finalPreparation: req.body.finalPreparation,
    finalGoalProgress: req.body.finalGoalProgress,
    finalAttitude: req.body.finalAttitude,
    finalGrade: req.body.finalGrade,
    comments: req.body.comments,
  };

  // Create and Save a new studentInstrumentEvaluation
  StudentInstrumentEvaluation.create(studentInstrumentEvaluation)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the studentInstrumentEvaluation.",
      });
    });
};

// Retrieve all studentInstrumentEvaluations from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  StudentInstrumentEvaluation.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving studentInstrumentEvaluations.",
      });
    });
};

// Retrieve a(n) studentInstrumentEvaluation by id
exports.findById = (req, res) => {
  const id = req.params.id;
  StudentInstrumentEvaluation.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentInstrumentEvaluation with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentInstrumentEvaluation with id=" + id,
      });
    });
};

// Update a(n) studentInstrumentEvaluation by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  StudentInstrumentEvaluation.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrumentEvaluation was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update studentInstrumentEvaluation with id=" +
            id +
            ". Maybe the studentInstrumentEvaluation was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating studentInstrumentEvaluation with id=" + id,
      });
    });
};

// Delete a(n) studentInstrumentEvaluation with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  StudentInstrumentEvaluation.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrumentEvaluation was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete studentInstrumentEvaluation with id=" +
            id +
            ". Maybe the studentInstrumentEvaluation was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete studentInstrumentEvaluation with id=" + id,
      });
    });
};

// Delete all studentInstrumentEvaluation from the database.
exports.deleteAll = (req, res) => {
  StudentInstrumentEvaluation.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} studentInstrumentEvaluations were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all studentInstrumentEvaluations.",
      });
    });
};
