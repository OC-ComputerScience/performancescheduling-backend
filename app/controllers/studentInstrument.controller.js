const db = require("../models");
const { Op } = require("sequelize");
const StudentInstrument = db.studentInstrument;

// Create and Save a new studentInstrument
exports.create = (req, res) => {
  // Validate request
  if (!req.body.studentRoleId) {
    res.status(400).send({
      message: "studentRoleId cannot be empty!",
    });
    return;
  } else if (!req.body.instructorRoleId) {
    res.status(400).send({
      message: "instructorRoleId cannot be empty!",
    });
    return;
  } else if (!req.body.instrumentId) {
    res.status(400).send({
      message: "instrumentId cannot be empty!",
    });
    return;
  } else if (!req.body.semesterId) {
    res.status(400).send({
      message: "semesterId cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const studentInstrument = {
    privateHours: req.body.privateHours,
    levelId: req.body.levelId,
    studentRoleId: req.body.studentRoleId,
    instructorRoleId: req.body.instructorRoleId,
    accompanistRoleId: req.body.accompanistRoleId,
    instrumentId: req.body.instrumentId,
    semesterId: req.body.semesterId,
    status: req.body.status,
  };

  // Create and Save a new studentInstrument
  StudentInstrument.create(studentInstrument)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the studentInstrument.",
      });
    });
};

// Retrieve all studentInstruments from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  StudentInstrument.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving studentInstruments.",
      });
    });
};

// Retrieve a(n) studentInstrument by id
exports.findById = (req, res) => {
  const id = req.params.id;
  StudentInstrument.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentInstrument with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentInstrument with id=" + id,
      });
    });
};

// Update a(n) studentInstrument by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  StudentInstrument.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrument was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update studentInstrument with id=" +
            id +
            ". Maybe the studentInstrument was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating studentInstrument with id=" + id,
      });
    });
};

// Delete a(n) studentInstrument with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  StudentInstrument.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrument was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete studentInstrument with id=" +
            id +
            ". Maybe the studentInstrument was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete studentInstrument with id=" + id,
      });
    });
};

// Delete all studentInstruments from the database.
exports.deleteAll = (req, res) => {
  StudentInstrument.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} studentInstruments were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all studentInstruments.",
      });
    });
};

exports.getByUserId = (req, res) => {
  StudentInstrument.findAll({
    include: [
      {
        model: db.userRole,
        as: "studentRole",
        required: true,
        include: [
          {
            model: db.user,
            required: true,
            where: {
              id: { [Op.eq]: req.params.userId },
            },
          },
        ],
      },
      {
        model: db.userRole,
        as: "instructorRole",
        required: true,
        include: [
          {
            model: db.user,
            required: true,
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

      {
        model: db.level,
        as: "endingLevel",
        required: false,
      },
      {
        model: db.semester,
        required: true,
      },
    ],
    order: [
      [{ model: db.semester }, "startDate", "DESC"],
      [{ model: db.instrument }, "name", "ASC"],
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving studentInstruments.",
      });
    });
};

exports.getStudentInstrumentSignupsByUserRoleId = (req, res) => {
  let date = req.query.date;
  let order = req.query.order;
  let dateRule =
    req.query.select == "GTE"
      ? { date: { [Op.gte]: date } }
      : { date: { [Op.lte]: date } };

  StudentInstrument.findAll({
    where: { studentRoleId: { [Op.eq]: req.params.userRoleId } },
    attributes: [["id", "studentInstrumentId"]],
    include: [
      {
        model: db.studentInstrumentSignup,
        required: true,
        include: [
          {
            model: db.studentInstrument,
            required: true,
            include: [{ model: db.instrument, required: true }],
          },
          {
            model: db.eventSignup,
            required: true,
            include: [
              {
                model: db.level,
                as: "endingLevelEventSignup",
                required: false,
              },
              {
                model: db.studentInstrumentSignup,
                required: false,
              },
              {
                model: db.event,
                required: true,
                where: dateRule,
                include: [
                  { model: db.eventType, required: true },
                  {
                    model: db.location,
                    required: true,
                  },
                  { model: db.semester, required: true },
                  { model: db.eventType, required: true },
                ],
              },
              {
                model: db.eventSignupPiece,
                required: true,
                include: [
                  {
                    model: db.piece,
                    required: true,
                    include: [
                      {
                        model: db.composer,
                        required: true,
                      },
                    ],
                  },
                  {
                    model: db.critique,
                    required: false,
                    include: [
                      {
                        model: db.userRole,
                        required: true,
                        include: [{ model: db.user, required: true }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: db.userRole,
            as: "instructorRoleSignup",
            required: true,
            attributes: [["id", "userRoleId"], "title", "roleId"],
            include: [
              {
                model: db.user,
                required: true,
              },
            ],
          },
          {
            model: db.userRole,
            as: "accompanistRoleSignup",
            required: false,
            attributes: [["id", "userRoleId"], "title", "roleId"],
            include: [
              {
                model: db.user,
                required: true,
              },
            ],
          },
        ],
      },
    ],
    order: [
      [db.studentInstrumentSignup, db.eventSignup, db.event, "date", order],
      [db.studentInstrumentSignup, db.eventSignup, "startTime"],
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving studentInstrumentSignups.",
      });
    });
};

exports.getStudentInstrumentSignupsByFacultyRoleId = (req, res) => {
  let date = req.query.date;
  let order = req.query.order;
  let dateRule =
    req.query.select == "GTE"
      ? { date: { [Op.gte]: date } }
      : { date: { [Op.lte]: date } };

  StudentInstrument.findAll({
    where: { instructorRoleId: { [Op.eq]: req.params.facultyRoleId } },
    attributes: [["id", "studentInstrumentId"]],
    include: [
      {
        model: db.studentInstrumentSignup,
        required: true,
        include: [
          {
            model: db.studentInstrument,
            required: true,
            include: [
              { model: db.instrument, required: true },
              {
                model: db.userRole,
                as: "studentRole",

                required: true,
                include: [{ model: db.user, required: true }],
              },
            ],
          },
          {
            model: db.eventSignup,
            required: true,
            include: [
              {
                model: db.level,
                as: "endingLevelEventSignup",
                required: false,
              },

              {
                model: db.studentInstrumentSignup,
                required: true,
                include: [
                  {
                    model: db.studentInstrument,
                    required: true,
                    include: [
                      {
                        model: db.userRole,
                        required: true,
                        as: "studentRole",
                        include: {
                          model: db.user,
                          required: true,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                model: db.event,
                required: true,
                where: dateRule,
                include: [
                  { model: db.eventType, required: true },
                  {
                    model: db.location,
                    required: true,
                  },
                  { model: db.semester, required: true },
                ],
              },
              {
                model: db.eventSignupPiece,
                required: true,
                include: [
                  {
                    model: db.piece,
                    required: true,
                    include: [
                      {
                        model: db.composer,
                        required: true,
                      },
                    ],
                  },
                  {
                    model: db.critique,
                    required: false,
                    include: [
                      {
                        model: db.userRole,
                        required: true,
                        include: [{ model: db.user, required: true }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: db.userRole,
            as: "instructorRoleSignup",
            required: true,
            attributes: [["id", "userRoleId"], "title", "roleId"],
            include: [
              {
                model: db.user,
                required: true,
              },
            ],
          },
          {
            model: db.userRole,
            as: "accompanistRoleSignup",
            required: false,
            attributes: [["id", "userRoleId"], "title", "roleId"],
            include: [
              {
                model: db.user,
                required: true,
              },
            ],
          },
        ],
      },
    ],
    order: [
      [db.studentInstrumentSignup, db.eventSignup, db.event, "date", order],
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving studentInstrumentSignups.",
      });
    });
};

exports.getStudentsForInstructorId = (req, res) => {
  let active = req.query.active;
  let activeRule = active != null ? { status: active } : "";

  db.user
    .findAll({
      include: {
        model: db.userRole,
        required: true,
        include: [
          {
            model: StudentInstrument,
            required: true,
            as: "studentRole",
            where: [{ instructorRoleId: req.params.instructorId }, activeRule],
            include: [
              {
                model: db.instrument,
                required: true,
              },
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
              {
                model: db.level,
                as: "endingLevel",
                required: false,
              },
              {
                model: db.level,
                as: "endingLevel",
                required: false,
              },
              {
                model: db.semester,
                required: true,
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
      res.status(500).send({ message: err.message });
    });
};

exports.getStudentsForAccompanistId = (req, res) => {
  let active = req.query.active;
  let activeRule = active != null ? { status: active } : "";
  db.user
    .findAll({
      include: {
        model: db.userRole,
        required: true,
        include: {
          model: StudentInstrument,
          required: true,
          as: "studentRole",
          where: [{ accompanistRoleId: req.params.accompanistId }, activeRule],
          include: {
            model: db.instrument,
            required: true,
          },
        },
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getStudentInstrumentsForStudentId = (req, res) => {
  let active = req.query.active;
  let activeRule = active && active!="All" ? { status: active } : "";

  StudentInstrument.findAll({
    where: [{ studentRoleId: req.params.studentId },activeRule],
    order: [
      [{ model: db.semester }, "startDate", "DESC"],
      [{ model: db.instrument }, "name", "ASC"],
    ],
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
      {
        model: db.level,
        as: "endingLevel",
        required: false,
      },
      {
        model: db.semester,
        required: false,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//Disable all students' instruments
exports.disableAllStudentsInstruments = (res) => {
  StudentInstrument.update({ status: 'Disabled' }, { where: {} })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    console.log(err.message);
  });
  };
