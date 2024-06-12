const db = require("../models");
const { Op } = require("sequelize");
const StudentInstrumentSignup = db.studentInstrumentSignup;

// Create and Save a new studentInstrumentSignup
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventSignupId) {
    res.status(400).send({
      message: "eventSignupId cannot be empty!",
    });
    return;
  } else if (!req.body.studentInstrumentId) {
    res.status(400).send({
      message: "studentInstrumentId cannot be empty!",
    });
    return;
  } else if (!req.body.instructorRoleId) {
    res.status(400).send({
      message: "instructorRoleId cannot be empty!",
    });
    return;
  }

  const studentInstrumentSignup = {
    eventSignupId: req.body.eventSignupId,
    studentInstrumentId: req.body.studentInstrumentId,
    instructorRoleId: req.body.instructorRoleId,
    accompanistRoleId: req.body.accompanistRoleId,
  };

  // Create and Save a new studentInstrumentSignup
  StudentInstrumentSignup.create(studentInstrumentSignup)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the studentInstrumentSignup.",
      });
    });
};

// Retrieve all studentInstrumentSignups from the database
exports.findAll = (req, res) => {
  const sortVar = req.query.sortVar;
  var order = [];

  if (sortVar != undefined) {
    order.push([sortVar, req.query.order]);
  }

  StudentInstrumentSignup.findAll({
    order: order,
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

// Retrieve a(n) studentInstrumentSignup by id
exports.findById = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentInstrumentSignup with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentInstrumentSignup with id=" + id,
      });
    });
};
exports.findByIdWithAllData = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.findByPk(id,{

    include: [
      {model: db.userRole, as: "instructorRoleSignup", required: true,
      include: [
        {model: db.user, required: true},
      ]},
      {model: db.userRole, as: "accompanistRoleSignup", required: false,
      include: [
        {model: db.user, required: true},
      ]},
      {model: db.studentInstrument, required: true, 
        include: [
          {model: db.instrument, required: true},
          {model: db.userRole, as: "studentRole", required: true, 
            include: [
              {model: db.user, required: true},
            ]},
            {model: db.level, required: false}
        ]}, 

    ]
  }
  )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentInstrumentSignup with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentInstrumentSignup with id=" + id,
      });
    });
};

exports.findAllbySignUpIdAllData = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.findAll({
    where: {eventSignupId: id},

    include: [
      {model: db.userRole, as: "instructorRoleSignup", required: true,
      include: [
        {model: db.user, required: true},
      ]},
      {model: db.userRole, as: "accompanistRoleSignup", required: false,
      include: [
        {model: db.user, required: true},
      ]},
      {model: db.studentInstrument, required: true, 
        include: [
          {model: db.instrument, required: true},
          {model: db.userRole, as: "studentRole", required: true, 
            include: [
              {model: db.user, required: true},
            ]},
            {model: db.level, required: false}
        ]}, 

    ]
  }
  )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Cannot find studentInstrumentSignup with id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentInstrumentSignup with id=" + id,
      });
    });
};

// Update a(n) studentInstrumentSignup by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrumentSignup was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update studentInstrumentSignup with id=" +
            id +
            ". Maybe the studentInstrumentSignup was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating studentInstrumentSignup with id=" + id,
      });
    });
};

// Delete a(n) studentInstrumentSignup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  StudentInstrumentSignup.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "StudentInstrumentSignup was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete studentInstrumentSignup with id=" +
            id +
            ". Maybe the studentInstrumentSignup was not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete studentInstrumentSignup with id=" + id,
      });
    });
};

// Delete all studentInstrumentSignups from the database.
exports.deleteAll = (req, res) => {
  StudentInstrumentSignup.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} studentInstrumentSignups were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all studentInstrumentSignups.",
      });
    });

};

exports.getByUserRoleId = (req, res) => {
  let date = req.query.date;
  let order = req.query.order;
  let dateRule =
    req.query.select == "GTE"
      ? { date: { [Op.gte]: date } }
      : { date: { [Op.lte]: date } };

  StudentInstrumentSignup.findAll({
    include: [
      {
        model: db.studentInstrument,
        where: {
          studentRoleId: { [Op.eq]: req.params.userRoleId },
        },
        include: [{ model: db.instrument, required: true }],
      },

      {
        model: db.eventSignup,
        required: true,
        include: [
          {
            model: db.studentInstrumentSignup,
            required: false,
          },
          {
            model: db.level,
            as: "endingLevelEventSignup",
            required: false,
          },
          {
            model: db.event,
            required: true,
            where: dateRule,
            include: [
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
    order: [
      [db.eventSignup, db.event, "date", order],
      [db.eventSignup, "startTime"],
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

exports.findAllWithAllData = (req, res) => {

  StudentInstrumentSignup.findAll({

    order: [
      [db.eventSignup, db.event, "date", "DESC"],
      [db.eventSignup, "startTime", "ASC"]
    ],

    include: [
      {
        model: db.eventSignup,
        required: true,
        include: [
          { model: db.event, required: true, 
            
            include: [
              {
                model: db.eventType,
                required: true,
              },
              {
                model: db.location,
                required: true,
              },
              {
                model: db.semester,
                required: true,
           
              },
            ]
          },
          {
            model: db.level,as:"endingLevelEventSignup",
          },
         
        //  {model: db.studentInstrumentSignup, required: true,
            
            //include: [
              // {model: db.userRole, as: "instructorRoleSignup", required: true,
              // include: [
              //   {model: db.user, required: true},
              // ]},
              // {model: db.userRole, as: "accompanistRoleSignup", required: false,
              // include: [
              //   {model: db.user, required: true},
              // ]},
              // {model: db.studentInstrument, required: true, 
              //   include: [
              //     {model: db.instrument, required: true},
              //     {model: db.userRole, as: "studentRole", required: true, 
              //       include: [
              //         {model: db.user, required: true},
              //       ]},
              //       {model: db.level, required: false}
              //   ]}, 

         //   ]
         // },
         
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
        ]
      },
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
            {model: db.userRole, as: "instructorRole", required: true,
              include: [
                {model: db.user, required: true},
              ]},
              {model: db.userRole, as: "accompanistRole", required: false,
              include: [
                {model: db.user, required: true},
              ]},
          {
            model: db.instrument,
            required: true,
          },
          {model :db.level, required: false},
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

