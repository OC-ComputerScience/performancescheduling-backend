const db = require("../models");
const { Op } = require("sequelize");
const Location = db.location;

// Create and Save a new location
exports.create = (req, res) => {
  // Validate request
  if (!req.body.roomName) {
    res.status(400).send({
      message: "roomName cannot be empty!",
    });
    return;
  } else if (!req.body.building) {
    res.status(400).send({
      message: "building cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const location = {
    roomName: req.body.roomName,
    roomNumber: req.body.roomNumber,
    building: req.body.building,
    status: req.body.status,
  };

  // Create and Save a new location
  Location.create(location)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the location.",
      });
    });
};

// Retrieve all locations from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([
      sortVar,
      req.query.order == undefined ? "ASC" : req.query.order,
    ]);
  }

  Location.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations.",
      });
    });
};

// Retrieve a(n) location by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Location.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find location with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving location with id=" + id,
      });
    });
};

// Update a(n) location by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Location.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Location was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update location with id=" +
            id +
            ". Maybe the location was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating location with id=" + id,
      });
    });
};

// Delete a(n) location with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Location.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Location was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete location with id=" +
            id +
            ". Maybe the location was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete location with id=" + id,
      });
    });
};

// Delete all locations from the database.
exports.deleteAll = (req, res) => {
  Location.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} locations were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all locations.",
      });
    });
};
