const db = require("../models");
const { Op } = require("sequelize");
const Piece = db.piece;

// Create and Save a new piece
exports.create = (req, res) => {
  // Validate request
  if (!req.body.composerId) {
    res.status(400).send({
      message: "composerId can not be empty!",
    });
    return;
  } else if (!req.body.title) {
    res.status(400).send({
      message: "title can not be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status can not be empty!",
    });
    return;
  }

  const piece = {
    composerId: req.body.composerId,
    title: req.body.title,
    originalLanguage: req.body.originalLanguage,
    originalLyrics: req.body.originalLyrics,
    poeticTranslation: req.body.poeticTranslation,
    literalTranslation: req.body.literalTranslation,
    status: req.body.status,
  };

  // Create and Save a new piece
  Piece.create(piece)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the piece.",
      });
    });
};

// Retrieve all pieces from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([
      sortVar,
      req.query.order == undefined ? "ASC" : req.query.order,
    ]);
  }

  Piece.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving pieces.",
      });
    });
};

// Retrieve a(n) piece by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Piece.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find piece with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving piece with id=" + id,
      });
    });
};

// Update a(n) piece by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Piece.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Piece was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update piece with id=" +
            id +
            ". Maybe the piece was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating piece with id=" + id,
      });
    });
};

// Delete a(n) piece with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Piece.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Piece was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete piece with id=" +
            id +
            ". Maybe the piece was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete piece with id=" + id,
      });
    });
};

// Delete all pieces from the database.
exports.deleteAll = (req, res) => {
  Piece.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} pieces were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all pieces.",
      });
    });
};

// Get by composer
exports.getByComposer = (req, res) => {
  Piece.findAll({
    where: {
      composerId: { [Op.eq]: req.params.composerId },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving pieces.",
      });
    });
};

// Retreive all pieces that are pending
exports.findAllByStatus = (req, res) => {
  Piece.findAll({
    where: { status: req.params.status },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving pieces.",
      });
    });
};
