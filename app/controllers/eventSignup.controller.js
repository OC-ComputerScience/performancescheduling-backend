const db = require("../models");
const { Op } = require("sequelize");
const EventSignup = db.eventSignup;

// Create and Save a new eventSignup
exports.create = (req, res) => {
  // Validate request
  if (!req.body.startTime) {
    res.status(400).send({
      message: "start time cannot be empty!",
    });
    return;
  } else if (!req.body.endTime) {
    res.status(400).send({
      message: "end time cannot be empty!",
    });
    return;
  } else if (!req.body.eventId) {
    res.status(400).send({
      message: "eventId cannot be empty!",
    });
    return;
  }

  const eventSignup = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    recordingLink: req.body.recordingLink,
    pass: req.body.pass,
    eventId: req.body.eventId,
  };

  // Create and Save a new eventSignup
  EventSignup.create(eventSignup)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the eventSignup.",
      });
    });
};

// Retrieve all eventSignups from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([
      sortVar,
      req.query.order == undefined ? "ASC" : req.query.order,
    ]);
  }

  EventSignup.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving eventSignups.",
      });
    });
};

// Retrieve a(n) eventSignup by id
exports.findById = (req, res) => {
  const id = req.params.id;
  EventSignup.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find eventSignup with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving eventSignup with id=" + id,
      });
    });
};

// Retrieve a(n) eventSignup by id
exports.findByEventId = (req, res) => {
  const id = req.params.id;
  EventSignup.findAll({
    where: {
      eventId: id,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find eventSignups with EventId=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving eventSignup with EventId=" + id,
      });
    });
};

// Update a(n) eventSignup by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  EventSignup.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "EventSignup was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update eventSignup with id=" +
            id +
            ". Maybe the eventSignup was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating eventSignup with id=" + id,
      });
    });
};

// Delete a(n) eventSignup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  EventSignup.findAll({
    where: {
      id: { [Op.eq]: id },
    },
    include: [
      {
        model: db.studentInstrumentSignup,
        required: false,
      },
      {
        model: db.critique,
        required: false,
      },
      {
        model: db.eventSignupPiece,
        required: false,
      },
    ],
  })
    .then(async (data) => {
      const curSingup = data[0].dataValues;

      for (let y = 0; y < curSingup.studentInstrumentSignups.length; y++) {
        const curStudentSignup =
          curSingup.studentInstrumentSignups[y].dataValues;
        await db.studentInstrumentSignup.destroy({
          where: { id: curStudentSignup.id },
        });
      }
      for (let y = 0; y < curSingup.critiques.length; y++) {
        const curCritique = curSingup.critiques[y].dataValues;
        await db.critique.destroy({ where: { id: curCritique.id } });
      }
      for (let y = 0; y < curSingup.eventSignupPieces.length; y++) {
        const curPiece = curSingup.eventSignupPieces[y].dataValues;
        await db.eventSignupPiece.destroy({ where: { id: curPiece.id } });
      }

      EventSignup.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "EventSignup was deleted successfully!",
            });
          } else {
            res.send({
              message:
                "Cannot delete eventSignup with id=" +
                id +
                ". Maybe the eventSignup was not found",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not delete eventSignup with id=" + id,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error finding eventSignup with id=" + id,
        error: err,
      });
    });
};

// Delete all eventSignups from the database.
exports.deleteAll = (req, res) => {
  EventSignup.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} eventSignups were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all eventSignups.",
      });
    });
};

// Retrieve all events by student
exports.getEventsByStudentId = (req, res) => {
  EventSignup.findAll({
    include: [
      {
        model: db.eventSignupPiece,
        required: true,
        include: {
          model: db.piece,
          required: true,
          include: {
            model: db.composer,
            required: true,
          },
        },
      },
      {
        model: db.critique,
        required: false,
        include: {
          model: db.userRole,
          required: true,
          include: {
            model: db.user,
            required: true,
          },
        },
      },
      {
        model: db.event,
        required: true,
        include: [
          {
            model: db.semester,
            required: true,
          },
          {
            model: db.eventType,
            required: true,
          },
          {
            model: db.location,
            required: true,
          },
        ],
      },
      {
        model: db.studentInstrumentSignup,
        required: true,
        include: [
          {
            model: db.userRole,
            as: "instructorRoleSignup",
            required: true,
            include: {
              model: db.user,
              required: true,
            },
          },
          {
            model: db.userRole,
            as: "accompanistRoleSignup",
            required: false,
            include: {
              model: db.user,
              required: true,
            },
          },
          {
            model: db.studentInstrument,
            required: true,
            include: [
              {
                model: db.instrument,
                required: true,
              },
              {
                model: db.userRole,
                as: "studentRole",
                required: true,
                where: { userId: req.params.userId },
              },
            ],
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};
