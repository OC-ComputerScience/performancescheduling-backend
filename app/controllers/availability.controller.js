const db = require("../models");
const { Op } = require("sequelize");
const Availability = db.availability;

// Create and Save a new availability
exports.create = (req, res) => {
  // Validate request
  if (!req.body.startTime) {
    res.status(400).send({
      message: "start time cannot be empty!",
    });
    return;
  } else if (!req.body.endTime) {
    res.status(400).send({
      message: "end time cannot be empty!",
    });
    return;
  } else if (!req.body.userRoleId) {
    res.status(400).send({
      message: "userRoleId cannot be empty!",
    });
    return;
  } else if (!req.body.eventId) {
    res.status(400).send({
      message: "eventId cannot be empty!",
    });
    return;
  }

  const availability = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    userRoleId: req.body.userRoleId,
    eventId: req.body.eventId,
  };

  // Create and Save a new availability
  Availability.create(availability)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the availability.",
      });
    });
};

// Retrieve all availabilities from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([
      sortVar,
      req.query.order == undefined ? "ASC" : req.query.order,
    ]);
  }

  Availability.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Availabilities.",
      });
    });
};

// Retrieve a(n) availability by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Availability.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find availability with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving availability with id=" + id,
      });
    });
};

// Update a(n) availability by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Availability.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Availability was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update availability with id=" +
            id +
            ". Maybe the availability was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating availability with id=" + id,
      });
    });
};

// Delete a(n) availability with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Availability.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Availability was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete availability with id=" +
            id +
            ". Maybe the availability was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete availability with id=" + id,
      });
    });
};

// Delete all availability from the database.
exports.deleteAll = (req, res) => {
  Availability.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} availability were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all availability.",
      });
    });
};

// Get all availability by a userRoleId
exports.getByUserRole = (req, res) => {
  Availability.findAll({
    where: {
      userRoleId: { [Op.eq]: req.params.userRoleId },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Availabilities.",
      });
    });
};

// Get all availabilities by userRoleId and eventId
exports.getByUserRoleAndEvent = (req, res) => {
  Availability.findAll({
    where: {
      userRoleId: { [Op.eq]: req.params.userRoleId },
      eventId: { [Op.eq]: req.params.eventId },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Availabilities.",
      });
    });
};
