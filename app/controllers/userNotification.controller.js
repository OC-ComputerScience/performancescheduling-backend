const db = require("../models");
const { Op } = require("sequelize");
const UserNotification = db.userNotification;

// Create and Save a new userNotification
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userRoleId) {
    res.status(400).send({
      message: "userRoleId cannot be empty!",
    });
    return;
  } else if (!req.body.notificationId) {
    res.status(400).send({
      message: "notificationId cannot be empty!",
    });
    return;
  } else if (!req.body.text) {
    res.status(400).send({
      message: "text cannot be empty!",
    });
    return;
  } else if (!req.body.data) {
    res.status(400).send({
      message: "data cannot be empty!",
    });
    return;
  } else if (!req.body.isCompleted === undefined) {
    res.status(400).send({
      message: "isCompleted cannot be empty!",
    });
    return;
  }

  const userNotification = {
    userRoleId: req.body.userRoleId,
    notificationId: req.body.notificationId,
    text: req.body.text,
    data: req.body.data,
    isCompleted: req.body.isCompleted,
  };

  // Create and Save a new userNotification
  UserNotification.create(userNotification)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the userNotification.",
      });
    });
};

// Retrieve all userNotifications from the database
exports.findAll = (req, res) => {
  UserNotification.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving userNotifications.",
      });
    });
};

// Retrieve a(n) userNotification by id
exports.findById = (req, res) => {
  const id = req.params.id;
  UserNotification.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find userNotification with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving userNotification with id=" + id,
      });
    });
};

// Update a(n) userNotification by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  UserNotification.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "UserNotification was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update userNotification with id=" +
            id +
            ". Maybe the userNotification was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating userNotification with id=" + id,
      });
    });
};

// Delete a(n) userNotification with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  UserNotification.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "UserNotification was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete userNotification with id=" +
            id +
            ". Maybe the userNotification was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete userNotification with id=" + id,
      });
    });
};

// Delete all userNotifications from the database.
exports.deleteAll = (req, res) => {
  UserNotification.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} userNotifications were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all userNotifications.",
      });
    });
};