const db = require("../models");
const { Op } = require("sequelize");
const StudentInstrumentSignup = db.studentInstrumentSignup;

// Create and Save a new studentInstrumentSignup
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventSignupId) {
    res.status(400).send({
      message: "eventSignupId cannot be empty!",
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
  }

  const studentInstrumentSignup = {
    eventSignupId: req.body.eventSignupId,
    studentInstrumentId: req.body.studentInstrumentId,
    instructorRoleId: req.body.instructorRoleId,
    accompanistRoleId: req.body.accompanistRoleId,
  };

  // Create and Save a new studentInstrumentSignup
  StudentInstrumentSignup.create(studentInstrumentSignup)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the studentInstrumentSignup.",
      });
    });
};

// Retrieve all studentInstrumentSignups from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  StudentInstrumentSignup.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving studentInstrumentSignups.",
      });
    });
};

// Retrieve a(n) studentInstrumentSignup by id
exports.findById = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentInstrumentSignup with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentInstrumentSignup with id=" + id,
      });
    });
};

// Update a(n) studentInstrumentSignup by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrumentSignup was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update studentInstrumentSignup with id=" +
            id +
            ". Maybe the studentInstrumentSignup was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating studentInstrumentSignup with id=" + id,
      });
    });
};

// Delete a(n) studentInstrumentSignup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrumentSignup was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete studentInstrumentSignup with id=" +
            id +
            ". Maybe the studentInstrumentSignup was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete studentInstrumentSignup with id=" + id,
      });
    });
};

// Delete all studentInstrumentSignups from the database.
exports.deleteAll = (req, res) => {
  StudentInstrumentSignup.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} studentInstrumentSignups were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all studentInstrumentSignups.",
      });
    });
};
