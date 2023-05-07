const db = require("../models");
const { Op } = require("sequelize");
const Level = db.level;

// Create and Save a new level
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "name cannot be empty!",
    });
    return;
  } else if (!req.body.description) {
    res.status(400).send({
      message: "description cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const level = {
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
  };

  // Create and Save a new level
  Level.create(level)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the level.",
      });
    });
};

// Retrieve all levels from the database
exports.findAll = (req, res) => {
  Level.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving levels.",
      });
    });
};

// Retrieve a(n) level by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Level.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find level with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving level with id=" + id,
      });
    });
};

// Update a(n) level by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Level.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Level was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update level with id=" +
            id +
            ". Maybe the level was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating level with id=" + id,
      });
    });
};

// Delete a(n) level with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Level.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Level was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete level with id=" +
            id +
            ". Maybe the level was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete level with id=" + id,
      });
    });
};

// Delete all levels from the database.
exports.deleteAll = (req, res) => {
  Level.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} levels were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all levels.",
      });
    });
};
