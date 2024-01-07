const db = require("../models");
const { Op } = require("sequelize");
const Event = db.event;

// Create and Save a new event
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "name cannot be empty!",
    });
    return;
  } else if (!req.body.date) {
    res.status(400).send({
      message: "date cannot be empty!",
    });
    return;
  } else if (!req.body.startTime) {
    res.status(400).send({
      message: "startTime cannot be empty!",
    });
    return;
  } else if (!req.body.endTime) {
    res.status(400).send({
      message: "endTime cannot be empty!",
    });
    return;
  } else if (req.body.isReady === undefined) {
    res.status(400).send({
      message: "isReady can not be empty!",
    });
    return;
  } else if (!req.body.eventTypeId) {
    res.status(400).send({
      message: "eventTypeId can not be empty!",
    });
    return;
  } else if (!req.body.semesterId) {
    res.status(400).send({
      message: "semesterId can not be empty!",
    });
    return;
  } else if (!req.body.locationId) {
    res.status(400).send({
      message: "locationId can not be empty!",
    });
    return;
  }

  const event = {
    name: req.body.name,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    isReady: req.body.isReady,
    privateUserRoleId: req.body.privateUserRoleId,
    eventTypeId: req.body.eventTypeId,
    semesterId: req.body.semesterId,
    locationId: req.body.locationId,
  };

  // Create and Save a new event
  Event.create(event)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event.",
      });
    });
};

// Retrieve all events from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  Event.findAll({
    order: order,
    include: [
      {
        model: db.location,
        required: true,
      },
      {
        model: db.semester,
        required: true,
      },
      {
        model: db.eventType,
        required: true,
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

// Retrieve a(n) event by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Event.findOne({
    where: { id: id },
    include: {
      model: db.eventSignup,
      include: [
        {
          model: db.studentInstrumentSignup,
          include: [
            {
              model: db.studentInstrument,
              include: [
                {
                  model: db.userRole,
                  as: "studentRole",
                  include: {
                    model: db.user,
                  },
                },
                {
                  model: db.instrument,
                  required: true,
                },
              ],
            },

            {
              model: db.userRole,
              required: true,
              as: "instructorRoleSignup",
              include: {
                model: db.user,
                required: true,
              },
            },
            {
              model: db.userRole,
              required: false,
              as: "accompanistRoleSignup",
              include: {
                model: db.user,
                required: true,
              },
            },
          ],
        },
      ],
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find event with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving event with id=" + id,
      });
    });
};

// Retrieve all events from the database from the specified date onwards
exports.findDateAndAfter = (req, res) => {
  const date = req.params.date;
  const role = req.query.role;
  const sortVar = req.query.sortVar;

  const includeModels = [
    {
      model: db.location,
      required: true,
    },
    {
      model: db.eventType,
      required: true,
    },
    {
      model: db.eventSignup,
      required: false,
      include: [
        {
          model: db.studentInstrumentSignup,
          required: false,
        },
      ],
    },
    {
      model: db.semester,
      required: false,
    },
  ];

  const whereObject = {
    date: {
      [Op.gte]: date,
    },
  };

  if (role === "Student") {
    whereObject.isReady = 1;
  } else if (role === "Admin") {
    includeModels.push({
      model: db.availability,
      required: false,
    });
  }

  var order = [];
  if (sortVar != undefined) {
    sortVar.split(",").forEach(function (item) {
      order.push([item, req.query.order]);
    });
  }

  Event.findAll({
    where: whereObject,
    include: includeModels,
    order: order,
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find event on or after " + date,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Update a(n) event by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Event.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update event with id=" +
            id +
            ". Maybe the event was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating event with id=" + id,
      });
    });
};

// Delete a(n) event with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  //get all student timeslots
  Event.findAll({
    where: {
      id: { [Op.eq]: id },
    },
    include: [
      {
        model: db.availability,
        required: false,
      },
      {
        model: db.eventSignup,
        required: false,
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
      },
    ],
  })
    .then(async (data) => {
      for (let x = 0; x < data[0].dataValues.availabilities.length; x++) {
        const curAvailability = data[0].dataValues.availabilities[x].dataValues;
        await db.availability.destroy({
          where: { id: curAvailability.id },
        });
      }
      for (let x = 0; x < data[0].dataValues.eventSignups.length; x++) {
        const curEventSignup = data[0].dataValues.eventSignups[x].dataValues;
        for (
          let y = 0;
          y < curEventSignup.studentInstrumentSignups.length;
          y++
        ) {
          const curStudentSignup =
            curEventSignup.studentInstrumentSignups[y].dataValues;
          await db.studentInstrumentSignup.destroy({
            where: { id: curStudentSignup.id },
          });
        }
        for (let y = 0; y < curEventSignup.critiques.length; y++) {
          const curCritique = curEventSignup.critiques[y].dataValues;
          await db.critique.destroy({ where: { id: curCritique.id } });
        }
        for (let y = 0; y < curEventSignup.eventSignupPieces.length; y++) {
          const curSignupPiece = curEventSignup.eventSignupPieces[y].dataValues;
          await db.eventSignupPiece.destroy({
            where: { id: curSignupPiece.id },
          });
        }

        db.eventSignup.destroy({ where: { id: curEventSignup.id } });
      }

      Event.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "Event was deleted successfully!",
            });
          } else {
            res.send({
              message:
                "Cannot delete event with id=" +
                id +
                ". Maybe the event was not found",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not delete event with id=" + id,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error finding event with id=" + id,
        error: err,
      });
    });
};

// Delete all events from the database.
exports.deleteAll = (req, res) => {
  Event.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} events were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all event.",
      });
    });
};

exports.getStudentInstrumentSignupsForEventId = (req, res) => {
  Event.findAll({
    where: { id: req.params.eventId },
    order: [[db.eventSignup, "startTime", "ASC"]],
    include: [
      {
        model: db.eventType,
        required: true,
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
                  {
                    model: db.instrument,
                    required: true,
                  },
                ],
              },
              {
                model: db.userRole,
                required: true,
                as: "instructorRoleSignup",
                include: {
                  model: db.user,
                  required: true,
                },
              },
              {
                model: db.userRole,
                required: false,
                as: "accompanistRoleSignup",
                include: {
                  model: db.user,
                  required: true,
                },
              },
            ],
          },
          {
            model: db.eventSignupPiece,
            required: true,
            include: [
              {
                model: db.piece,
                required: true,
                include: {
                  model: db.composer,
                  required: true,
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

// Retrieve all events by semester
exports.getEventsBySemesterId = (req, res) => {
  Event.findAll({
    where: { semesterId: { [Op.eq]: req.params.semesterId } },
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
