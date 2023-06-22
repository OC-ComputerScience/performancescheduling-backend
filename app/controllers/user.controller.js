const db = require("../models");
const { Op } = require("sequelize");
const User = db.user;

// Create and Save a new user
exports.create = (req, res) => {
  // Validate request
  if (!req.body.firstName) {
    res.status(400).send({
      message: "firstName cannot be empty!",
    });
    return;
  } else if (!req.body.lastName) {
    res.status(400).send({
      message: "lastName cannot be empty!",
    });
    return;
  } else if (!req.body.email) {
    res.status(400).send({
      message: "email cannot be empty!",
    });
    return;
  } else if (!req.body.authenticationType) {
    res.status(400).send({
      message: "authenticationType cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    honorific: req.body.honorific,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    authenticationType: req.body.authenticationType,
    password: req.body.password,
    picture: req.body.picture,
    emailStatus: req.body.emailStatus,
    textStatus: req.body.textStatus,
    googleToken: req.body.googleToken,
    status: req.body.status,
  };

  // Create and Save a new user
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

// Retrieve all users from the database
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Retrieve a(n) user by id
exports.findById = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find user with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id,
      });
    });
};

// Update a(n) user by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update user with id=" +
            id +
            ". Maybe the user was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// Disable a(n) user by the id in the request
exports.disable = (req, res) => {
  const id = req.params.id;
  User.update(
    { status: "Disabled" },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was disabled successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot disable user with id=" +
            id +
            ". Maybe the user was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error disabling user with id=" + id,
      });
    });
};

// Enable a(n) user by the id in the request
exports.enable = (req, res) => {
  const id = req.params.id;
  User.update(
    { status: "Active" },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was enabled successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot enabled user with id=" +
            id +
            ". Maybe the user was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error enabling user with id=" + id,
      });
    });
};

// Delete a(n) user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete user with id=" +
            id +
            ". Maybe the user was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
      });
    });
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

exports.getAllWithRoles = (req, res) => {
  User.findAll({
    include: {
      model: db.userRole,
      required: false,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.getAllWithRolesAndStudentInstrumentData = (req, res) => {
  User.findAll({
    include: {
      model: db.userRole,
      required: false,
      include: [
        {
          model: db.studentInstrument,
          as: "studentRole",
          required: false,
          include: [
            {
              model: db.userRole,
              as: "instructorRole",
              required: true,
              include: [
                {
                  model: db.user,
                  required: true,
                },
                {
                  model: db.availability,
                  required: false,
                },
              ],
            },
            {
              model: db.userRole,
              as: "accompanistRole",
              required: false,
              include: [
                {
                  model: db.user,
                  required: true,
                },
                {
                  model: db.availability,
                  required: false,
                },
              ],
            },
            {
              model: db.instrument,
              required: true,
            },
            {
              model: db.level,
              required: false,
            },
          ],
        },
        {
          model: db.role,
          required: true,
        },
        {
          model: db.major,
          required: false,
        },
      ],
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
