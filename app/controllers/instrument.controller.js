const db = require("../models");
const { Op } = require("sequelize");
const Instrument = db.instrument;

// Create and Save a new instrument
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "name cannot be empty!",
    });
    return;
  } else if (!req.body.type) {
    res.status(400).send({
      message: "type cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const instrument = {
    name: req.body.name,
    type: req.body.type,
    status: req.body.status,
  };

  // Create and Save a new instrument
  Instrument.create(instrument)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the instrument.",
      });
    });
};

// Retrieve all instruments from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  Instrument.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving instruments.",
      });
    });
};

// Retrieve a(n) instrument by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Instrument.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find instrument with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving instrument with id=" + id,
      });
    });
};

// Update a(n) instrument by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Instrument.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Instrument was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update instrument with id=" +
            id +
            ". Maybe the instrument was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating instrument with id=" + id,
      });
    });
};

// Delete a(n) instrument with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Instrument.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Instrument was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete instrument with id=" +
            id +
            ". Maybe the instrument was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete instrument with id=" + id,
      });
    });
};

// Delete all instruments from the database.
exports.deleteAll = (req, res) => {
  Instrument.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} instruments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all instruments.",
      });
    });
};

// Retreive all instruments that are pending
exports.findAllByStatus = (req, res) => {
  Instrument.findAll({
    where: { status: req.params.status },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving instruments.",
      });
    });
};
