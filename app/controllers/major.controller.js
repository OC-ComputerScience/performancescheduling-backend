const db = require("../models");
const { Op } = require("sequelize");
const Major = db.major;

// Create and Save a new major
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "name cannot be empty!",
    });
    return;
  } else if (!req.body.isMusicMajor === undefined) {
    res.status(400).send({
      message: "isMusicMajor cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const major = {
    name: req.body.name,
    isMusicMajor: req.body.isMusicMajor,
    status: req.body.status,
  };

  // Create and Save a new major
  Major.create(major)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the major.",
      });
    });
};

// Retrieve all majors from the database
exports.findAll = (req, res) => {
  Major.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving majors.",
      });
    });
};

// Retrieve a(n) major by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Major.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find major with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving major with id=" + id,
      });
    });
};

// Update a(n) major by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Major.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Major was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update major with id=" +
            id +
            ". Maybe the major was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating major with id=" + id,
      });
    });
};

// Delete a(n) major with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Major.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Major was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete major with id=" +
            id +
            ". Maybe the major was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete major with id=" + id,
      });
    });
};

// Delete all majors from the database.
exports.deleteAll = (req, res) => {
  Major.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} majors were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all majors.",
      });
    });
};
