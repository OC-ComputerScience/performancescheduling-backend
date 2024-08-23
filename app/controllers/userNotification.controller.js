const db = require("../models");
const { Op } = require("sequelize");
const UserNotification = db.userNotification;
const Notification = db.notification;
const UserRole = db.userRole;
const User = db.user;
const { sendMail } = require("../utilities/sendMail.js");

// Create and Save a new userNotification
exports.create = async (req, res) => {
  // Validate request
  // if (!req.body.userRoleId) {
  //   res.status(400).send({
  //     message: "userRoleId cannot be empty!",
  //   });
  //   return;
  //} else
   if (!req.body.notificationId) {
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
  let from = null;
  if (req.body.from !== undefined) from = req.body.from;

  // lool up notice type for subject
  let subject = "";

  await Notification.findByPk(req.body.notificationId)
    .then((data) => {
      subject = data.type;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the userNotification.",
      });
      return;
    });

  let user = {};
  if (req.body.userRoleId != undefined && req.body.userRoleId != null) {

  await UserRole.findAll({
    where: {
      id: { [Op.eq]: req.body.userRoleId },
    },
    include: [{ model: db.user }],
  })
    .then((data) => {
      user = data[0].user;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the userNotification.",
      });
      return;
    });
  } else {
    // get the first admin user
   var adminId = null;
   await User.findAll({
      where: {adminEmail: true},
      include: {
        model: db.userRole,
        required: true,
        where: { roleId: 3 },
      },
    })
      .then((data) => {
        user = data[0];
        adminId = user.userRoles.find(userRole => userRole.roleId === 3).id;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving admin users.",
        });
        return
      });
    }

   
  const userNotification = {
    userRoleId: req.body.userRoleId != null ? req.body.userRoleId : adminId ,
    notificationId: req.body.notificationId,
    text: req.body.text,
    data: req.body.data,
    isCompleted: req.body.isCompleted,
  };

  // Create and Save a new userNotification
  UserNotification.create(userNotification)
    .then((data) => {
      // Send email to user
      console.log("Sending email to: " + user.email+"from: "+from + " emailStatus: "+user.emailStatus );
      if (from != null && user.emailStatus) {
        console.log("Sending email to: " + user.email);
        sendMail(
          from,
          user.email,
          "",
          "Performance Scheduling : " + subject,
          user.firstName + ",\n\n" + req.body.text + ".\n\n Thanks!"
        );
      }
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
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  UserNotification.findAll({
    order: order,
  })
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

// Get all notifications for a user's role
exports.getByUserRoleId = (req, res) => {
  UserNotification.findAll({
    where: {
      userRoleId: { [Op.eq]: req.params.userRoleId },
      isCompleted: { [Op.eq]: false },
    },

    include: [
      {
        model: db.notification,
        required: true,
      },
    ],
  })
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
