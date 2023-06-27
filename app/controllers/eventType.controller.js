const db = require("../models");
const { Op } = require("sequelize");
const EventType = db.eventType;

// Create and Save a new eventType
exports.create = (req, res) => {
  // Validate request
  if (!req.body.type) {
    res.status(400).send({
      message: "type cannot be empty!",
    });
    return;
  } else if (!req.body.slotType) {
    res.status(400).send({
      message: "slotType cannot be empty!",
    });
    return;
  } else if (!req.body.instrumentType) {
    res.status(400).send({
      message: "instrumentType cannot be empty!",
    });
    return;
  } else if (!req.body.description) {
    res.status(400).send({
      message: "description cannot be empty!",
    });
    return;
  } else if (!req.body.defaultSlotDuration) {
    res.status(400).send({
      message: "defaultSlotDuration cannot be empty!",
    });
    return;
  } else if (req.body.isPrivate === undefined) {
    res.status(400).send({
      message: "isPrivate cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const eventType = {
    type: req.body.type,
    slotType: req.body.slotType,
    instrumentType: req.body.instrumentType,
    description: req.body.description,
    defaultSlotDuration: req.body.defaultSlotDuration,
    isPrivate: req.body.isPrivate,
    status: req.body.status,
  };

  // Create and Save a new eventType
  EventType.create(eventType)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the eventType.",
      });
    });
};

// Retrieve all eventTypes from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  EventType.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving eventTypes.",
      });
    });
};

// Retrieve a(n) eventType by id
exports.findById = (req, res) => {
  const id = req.params.id;
  EventType.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find eventType with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving eventType with id=" + id,
      });
    });
};

// Update a(n) eventType by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  EventType.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "EventType was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update eventType with id=" +
            id +
            ". Maybe the eventType was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating eventType with id=" + id,
      });
    });
};

// Delete a(n) eventType with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  EventType.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "EventType was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete eventType with id=" +
            id +
            ". Maybe the eventType was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete eventType with id=" + id,
      });
    });
};

// Delete all eventTypes from the database.
exports.deleteAll = (req, res) => {
  EventType.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} eventTypes were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all eventTypes.",
      });
    });
};
