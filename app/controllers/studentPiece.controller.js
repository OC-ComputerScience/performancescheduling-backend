const db = require("../models");
const { Op } = require("sequelize");
const StudentPiece = db.studentPiece;

// Create and Save a new studentPiece
exports.create = (req, res) => {
  // Validate request
  if (!req.body.studentInstrumentId) {
    res.status(400).send({
      message: "studentInstrumentId cannot be empty!",
    });
    return;
  } else if (!req.body.pieceId) {
    res.status(400).send({
      message: "pieceId cannot be empty!",
    });
    return;
  } else if (!req.body.status) {
    res.status(400).send({
      message: "status cannot be empty!",
    });
    return;
  }

  const studentPiece = {
    studentInstrumentId: req.body.studentInstrumentId,
    pieceId: req.body.pieceId,
    semesterId: req.body.semesterId,
    status: req.body.status,
  };

  // Create and Save a new studentPiece
  StudentPiece.create(studentPiece)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the studentPiece.",
      });
    });
};

// Retrieve all studentPieces from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  StudentPiece.findAll({
    order: order,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving studentPieces.",
      });
    });
};

// Retrieve a(n) studentPiece by id
exports.findById = (req, res) => {
  const id = req.params.id;
  StudentPiece.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentPiece with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentPiece with id=" + id,
      });
    });
};

// Update a(n) studentPiece by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  StudentPiece.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentPiece was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update studentPiece with id=" +
            id +
            ". Maybe the studentPiece was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating studentPiece with id=" + id,
      });
    });
};

// Delete a(n) studentPiece with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  StudentPiece.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentPiece was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete studentPiece with id=" +
            id +
            ". Maybe the studentPiece was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete studentPiece with id=" + id,
      });
    });
};

// Delete all studentPieces from the database.
exports.deleteAll = (req, res) => {
  StudentPiece.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} studentPieces were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all studentPieces.",
      });
    });
};

exports.getStudentRepertoire = async (req, res) => {
  await StudentPiece.findAll({
    include: [
      {
        model: db.studentInstrument,
        required: true,
        include: [
          {
            model: db.userRole,
            as: "studentRole",
            required: true,
            include: {
              model: db.user,
              required: true,
              where: {
                id: { [Op.eq]: req.params.userId },
              },
            },
          },
          { model: db.instrument, required: true },
        ],
      },
      {
        model: db.piece,
        required: true,
        include: {
          model: db.composer,
          required: true,
        },
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving studentPieces.",
      });
    });
};

exports.getSemesterStudentRepertoire = async (req, res) => {
  var returnData;
  await db.semester
    .findAll({
      include: {
        model: db.studentPiece,
        required: true,
        include: [
          {
            model: db.studentInstrument,
            required: true,
            include: [
              {
                model: db.userRole,
                as: "studentRole",
                required: true,
                include: {
                  model: db.user,
                  required: true,
                  where: {
                    id: { [Op.eq]: req.params.userId },
                  },
                },
              },
              { model: db.instrument, required: true },
            ],
          },
          {
            model: db.piece,
            required: true,
            include: {
              model: db.composer,
              required: true,
            },
          },
        ],
      },
    })
    .then((data) => {
      // res.send(data);
      returnData = data;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving studentPieces.",
      });
    });

  await StudentPiece.findAll({
    where: {
      semesterId: { [Op.is]: null },
    },
    include: [
      {
        model: db.studentInstrument,
        required: true,
        include: [
          {
            model: db.userRole,
            as: "studentRole",
            required: true,
            include: {
              model: db.user,
              required: true,
              where: {
                id: { [Op.eq]: req.params.userId },
              },
            },
          },
          { model: db.instrument, required: true },
        ],
      },
      {
        model: db.piece,
        required: true,
        include: {
          model: db.composer,
          required: true,
        },
      },
    ],
  })
    .then((data) => {
      if (data.length > 0) {
        returnData.push({ id: null, studentPieces: data });
      }
      res.send(returnData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving studentPieces.",
      });
    });
};
