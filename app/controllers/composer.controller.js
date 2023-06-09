const db = require("../models");
const { Op } = require("sequelize");
const Composer = db.composer;

// Create and Save a new composer
exports.create = (req, res) => {
  // Validate request
  if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const composer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    dateOfBirth: req.body.dateOfBirth,
    dateOfDeath: req.body.dateOfDeath,
    status: req.body.status,
  };

  // Create and Save a new composer
  Composer.create(composer)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the composer.",
      });
    });
};

// Retrieve all composers from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  Composer.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving composers.",
      });
    });
};

// Retrieve a(n) composer by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Composer.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find composer with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving composer with id=" + id,
      });
    });
};

// Update a(n) composer by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Composer.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Composer was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update composer with id=" +
            id +
            ". Maybe the composer was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating composer with id=" + id,
      });
    });
};

// Delete a(n) composer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Composer.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Composer was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete composer with id=" +
            id +
            ". Maybe the composer was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete composer with id=" + id,
      });
    });
};

// Delete all composer from the database.
exports.deleteAll = (req, res) => {
  Composer.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} composers were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all composers.",
      });
    });
};

// Retreive all composers that are pending
exports.findAllByStatus = (req, res) => {
  Composer.findAll({
    where: { status: req.params.status },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving composers.",
      });
    });
};
