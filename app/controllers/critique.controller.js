const db = require("../models");
const { Op } = require("sequelize");
const Critique = db.critique;

// Create and Save a new critique
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userRoleId) {
    res.status(400).send({
      message: "userRoleId cannot be empty!",
    });
    return;
  } else if (!req.body.eventSignupPieceId) {
    res.status(400).send({
      message: "eventSignupPieceId cannot be empty!",
    });
    return;
  } else if (!req.body.overallComment) {
    res.status(400).send({
      message: "overallComment can not be empty!",
    });
    return;
  }

  const critique = {
    userRoleId: req.body.userRoleId,
    eventSignupPieceId: req.body.eventSignupPieceId,
    accuracyComment: req.body.accuracyComment,
    accuracyGrade: req.body.accuracyGrade,
    balanceComment: req.body.balanceComment,
    balanceGrade: req.body.balanceGrade,
    deportmentComment: req.body.deportmentComment,
    deportmentGrade: req.body.deportmentGrade,
    dictionComment: req.body.dictionComment,
    dictionGrade: req.body.dictionGrade,
    interpretationComment: req.body.interpretationComment,
    interpretationGrade: req.body.interpretationGrade,
    techniqueComment: req.body.toneComment,
    techniqueGrade: req.body.toneGrade,
    toneComment: req.body.toneComment,
    toneGrade: req.body.toneGrade,
    overallComment: req.body.overallComment,
  };

  // Create and Save a new critique
  Critique.create(critique)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the critique.",
      });
    });
};

// Retrieve all critiques from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  Critique.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving critiques.",
      });
    });
};

// Retrieve a(n) critique by id
exports.findById = (req, res) => {
  const id = req.params.id;
  Critique.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find critique with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving critique with id=" + id,
      });
    });
};

// Update a(n) critique by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Critique.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Critique was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update critique with id=" +
            id +
            ". Maybe the critique was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating critique with id=" + id,
      });
    });
};

// Delete a(n) critique with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Critique.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Critique was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete critique with id=" +
            id +
            ". Maybe the critique was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete critique with id=" + id,
      });
    });
};

// Delete all critique from the database.
exports.deleteAll = (req, res) => {
  Critique.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} critiques were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all critiques.",
      });
    });
};

exports.getCritiqueByEventSignupAndJuror = (req, res) => {
  Critique.findAll({
    where: {
      userRoleId: req.params.userRoleId,
      eventSignupId: req.params.eventSignupId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getBySemesterId = (req, res) => {
  Critique.findAll({
    include: {
      model: db.eventSignup,
      required: true,
      include: [
        {
          model: db.event,
          required: true,
          where: {
            semesterId: req.params.semesterId,
          },
        },
        {
          model: db.studentInstrumentSignup,
          required: true,
          include: {
            model: db.studentInstrument,
            required: true,
            include: {
              model: db.userRole,
              as: "studentRole",
              include: {
                model: db.user,
                required: true,
              },
            },
          },
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

exports.getBySemesterIdAndStudentId = (req, res) => {
  Critique.findAll({
    include: {
      model: db.eventSignup,
      required: true,
      include: [
        {
          model: db.event,
          required: true,
          where: {
            semesterId: req.params.semesterId,
          },
        },
        {
          model: db.studentInstrumentSignup,
          required: true,
          include: {
            model: db.studentInstrument,
            required: true,
            include: [
              {
                model: db.userRole,
                as: "studentRole",
                include: {
                  model: db.user,
                  required: true,
                  where: { id: req.params.userId },
                },
              },
              {
                model: db.instrument,
                required: true,
              },
            ],
          },
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
