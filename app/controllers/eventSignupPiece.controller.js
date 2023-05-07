const db = require("../models");
const { Op } = require("sequelize");
const EventSignupPiece = db.eventSignupPiece;

// Create and Save a new eventSignupPiece
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventSignupId) {
    res.status(400).send({
      message: "eventSignupId cannot be empty!",
    });
    return;
  } else if (!req.body.pieceId) {
    res.status(400).send({
      message: "pieceId cannot be empty!",
    });
    return;
  }

  const eventSignupPiece = {
    eventSignupId: req.body.eventSignupId,
    pieceId: req.body.pieceId,
  };

  // Create and Save a new eventSignupPiece
  EventSignupPiece.create(eventSignupPiece)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the eventSignupPiece.",
      });
    });
};

// Retrieve all eventSignupPieces from the database
exports.findAll = (req, res) => {
  EventSignupPiece.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving eventSignupPieces.",
      });
    });
};

// Retrieve a(n) eventSignupPiece by id
exports.findById = (req, res) => {
  const id = req.params.id;
  EventSignupPiece.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find eventSignupPiece with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving eventSignupPiece with id=" + id,
      });
    });
};

// Update a(n) eventSignupPiece by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  EventSignupPiece.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "EventSignupPiece was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update eventSignupPiece with id=" +
            id +
            ". Maybe the eventSignupPiece was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating eventSignupPiece with id=" + id,
      });
    });
};

// Delete a(n) eventSignupPiece with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  EventSignupPiece.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "EventSignupPiece was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete eventSignupPiece with id=" +
            id +
            ". Maybe the eventSignupPiece was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete eventSignupPiece with id=" + id,
      });
    });
};

// Delete all eventSignupPieces from the database.
exports.deleteAll = (req, res) => {
  EventSignupPiece.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} eventSignupPieces were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all eventSignupPieces.",
      });
    });
};

exports.getByEventSignupId = (req, res) => {
  EventSignupPiece.findAll({
    where: { eventSignupId: req.params.eventSignupId },
    include: {
      model: db.piece,
      required: true,
      include: {
        model: db.composer,
        required: true,
      },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving eventSignupPiece",
      });
    });
};
