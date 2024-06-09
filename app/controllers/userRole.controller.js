const db = require("../models");
const { Op } = require("sequelize");
const UserRole = db.userRole;

// Create and Save a new userRole
exports.create = (req, res) => {
  // Validate request
  if (req.body.studentClassification != null) {
    if (!req.body.majorId) {
      res.status(400).send({
        message: "majorId cannot be empty!",
      });
      return;
    }
  } else if (!req.body.roleId) {
    res.status(400).send({
      message: "roleId cannot be empty!",
    });
    return;
  } else if (!req.body.userId) {
    res.status(400).send({
      message: "userId cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const userRole = {
    majorId: req.body.majorId,
    roleId: req.body.roleId,
    userId: req.body.userId,
    studentClassification: req.body.studentClassification,
    studentSemesters: req.body.studentSemesters,
    facultyType: req.body.facultyType,
    title: req.body.title,
    status: req.body.status,
  };

  // Create and Save a new userRole
  UserRole.create(userRole)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the userRole.",
      });
    });
};

// Retrieve all userRoles from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  UserRole.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userRoles.",
      });
    });
};
// Retrieve all userRoles from the database for a type and status
exports.findAllTypeStatus = (req, res) => {
  const sortVar = req.query.sortVar;
  const type = req.query.type;
  const status = req.query.status;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  UserRole.findAll({
    order: order,where: { type: { [Op.eq]: type }, status: { [Op.eq]: status } },include :{model: db.user, required: true, where: {status: { [Op.eq]: "Active" }}}  
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userRoles.",
      });
    });
};

// Retrieve a(n) userRole by id
exports.findById = (req, res) => {
  const id = req.params.id;
  UserRole.findByPk(id,
    {include: [{ model: db.role }, { model: db.user }, { model: db.major }],})
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find userRole with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving userRole with id=" + id,
      });
    });
};

// Update a(n) userRole by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  UserRole.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "UserRole was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update userRole with id=" +
            id +
            ". Maybe the userRole was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating userRole with id=" + id,
      });
    });
};

// Delete a(n) userRole with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  UserRole.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "UserRole was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete userRole with id=" +
            id +
            ". Maybe the userRole was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete userRole with id=" + id,
      });
    });
};

// Delete all userRoles from the database.
exports.deleteAll = (req, res) => {
  UserRole.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} userRoles were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all userRoles.",
      });
    });
};

exports.getRolesForUser = (req, res) => {
  UserRole.findAll({
    where: {
      userId: { [Op.eq]: req.params.userId },
      status: { [Op.eq]: "Active" },
    },
    include: [{ model: db.role }, { model: db.user }, { model: db.major }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userRoles.",
      });
    });
};

exports.getAllRolesForRoleId = (req, res) => {
  const sortVar = req.query.sortVar;
  const order = [];
  let userStatus = null
  if (req.query.userStatus=="All") 
      userStatus ="";
    else
       userStatus= { status: { [Op.eq]: "Active" }}; 
  console.log("userStatus", req.query.userStatus);
  if (sortVar != undefined) {
    sortVar.split(",").forEach(function (item) {
      order.push([db.user, item, req.query.order]);
    });
  }

  UserRole.findAll({
    order: [[db.user, "lastName", "ASC"], [db.user, "firstName", "ASC"] ],
    where: {
      roleId: { [Op.eq]: req.params.roleId },
      status: { [Op.eq]: "Active" },
    },
    include: {
      model: db.user,
      where:  userStatus,
      required: true,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userRoles.",
      });
    });
};
