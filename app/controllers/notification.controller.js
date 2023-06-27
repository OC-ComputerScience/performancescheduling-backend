const db = require("../models");
const { Op } = require("sequelize");
const Notification = db.notification;

// Create and Save a new notification
exports.create = (req, res) => {
  // Validate request
  if (!req.body.type) {
    res.status(400).send({
      message: "type cannot be empty!",
    });
    return;
  }

  const notification = {
    type: req.body.type,
  };

  // Create and Save a new notification
  Notification.create(notification)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the notification.",
      });
    });
};

// Retrieve all notifications from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([
      sortVar,
      req.query.order == undefined ? "ASC" : req.query.order,
    ]);
  }

  Notification.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
};

// Retrieve a(n) notification by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Notification.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find notification with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving notification with id=" + id,
      });
    });
};

// Update a(n) notification by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Notification.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update notification with id=" +
            id +
            ". Maybe the notification was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating notification with id=" + id,
      });
    });
};

// Delete a(n) notification with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Notification.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete notification with id=" +
            id +
            ". Maybe the notification was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete notification with id=" + id,
      });
    });
};

// Delete all notifications from the database.
exports.deleteAll = (req, res) => {
  Notification.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} notifications were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all notifications.",
      });
    });
};
