const db = require("../models");
const { Op } = require("sequelize");
const Event = db.event;
const EventSignup = db.eventSignup;
const UserRole = db.userRole;
const User = db.user;
const Availability = db.availability;
const { sendMail } = require("../utilities/sendMail.js");

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
    order: [[db.eventSignup, "startTime", "ASC"]],
    include: {
      model: db.eventSignup,
      include: [
        { model: db.eventSignupPiece , include: {model: db.piece, include : {model: db.composer}}, required: false},
        {
          model: db.studentInstrumentSignup,
          include: [
            {
              model: db.studentInstrument,
              include: [
                {
                  model: db.userRole,
                  as: "studentRole",
                  include:[
                    {model: db.user},
                    {model: db.major}
                  ]
                },
                {
                  model: db.instrument,
                  required: true,
                },
                {
                  model: db.userRole,
                  required: true,
                  as: "instructorRole",
                  include: {
                    model: db.user,
                    required: true,
                  },
                },
                {
                  model: db.userRole,
                  required: false,
                  as: "accompanistRole",
                  include: {
                    model: db.user,
                    required: true,
                  },
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

// Email all Active Students for events  

exports.emailActiveStudentsForEvent = async (req, res) => {
  const eventId = req.params.id;
  const fromEmail = req.body.fromEmail;
  console.log('Sending email to all active students for event: '+eventId+" from: "+fromEmail)
  
  let event;
  let userRoles;
  // get event data
  await Event.findOne({
    where: { id: eventId }, include : {model : db.location, required : true}}).then((data) => {
      
      event = data.dataValues;
      
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving event for event="+eventId,
      });
      return;
    })
 if (event.isReady ) { 
  // get all active students
  await UserRole.findAll({
      where: { roleId: 1 , status: "Active" },include : {model: db.user, required: true, where: {status: "Active" }}  
    })
      .then((data) => {
      
        userRoles=data;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving userRoles.",
        });
        return;
      });
     
// send email to all active students
    let from = fromEmail;
    let subject = 'Music Event Notification :' + event.name;
   
    let date = new Date(event.date + " 00:00:00").toLocaleDateString("us-EN");
    let startTime = new Date(event.date + " "+event.startTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
    let endTime = new Date(event.date + " "+event.endTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
    
    userRoles.forEach((userRole) => {
      if (userRole.dataValues.user.emailStatus) {
       
      let body=   userRole.dataValues.user.firstName+",\n\n"+ event.name+' is ready for student sign up. It will be held on '+date+' at '+startTime+' to '+endTime+' in '+event.location.roomName + '.\n\n'+
    'Please visit performance.oc.edu and signup for this event.\n\nOC Music Department';

      let to = userRole.dataValues.user.email;
      console.log('Sending email to: '+to+" from: " +from+" \n"+subject+"\n"+ body);
      sendMail (from, to, "", subject, body)
      }
    })
    res.status(200).send({message: "Emails sent to all active students for event: "+eventId});
  }
  };

  exports.emailActiveInstAccForEvent = async (req, res) => {
    const eventId = req.params.id;
    const fromEmail = req.body.fromEmail;
    console.log('Sending email to all active Instructors/Accomp for event: '+eventId+" from: "+fromEmail)
    let event;
    let users;
    // get event data
    await Event.findOne({
      where: { id: eventId }, include : {model : db.location, required : true}}).then((data) => {
        event = data.dataValues;
      }).catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving event for event="+eventId,
        });
        return;
      })
  
    // get all active instructors/accompanists
    await User.findAll({
        where: {status: "Active" }, 
        include : {model: db.userRole, required: true, where :  {[Op.or] : [{roleId: 4 },{ roleId: 2}], status: "Active" }}  
        })
        .then((data) => {
        
          users=data;
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving userRoles.",
          });
          return;
        });
       
  // send email to all instructors/accompanists
      let from = fromEmail;
      let subject = 'Music Event Notification :' + event.name;
     
      let date = new Date(event.date + " 00:00:00").toLocaleDateString("us-EN");
      let startTime = new Date(event.date + " "+event.startTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
      let endTime = new Date(event.date + " "+event.endTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
    
      let body;
      users.forEach((user) => {
        if (user.dataValues.emailStatus) {
        if (event.isReady) {
        body=   user.dataValues.firstName+",\n\n"+ event.name+' is ready for student sign up. It will be held on '+date+' at '+startTime+' to '+endTime+' at '+event.location.roomName + '.\n\n'+
      'Please visit performance.oc.edu and signup for this event. Please remind your student to signup if they intend to perform.\n\nOC Music Department';
        } else {
          body=   user.dataValues.firstName+",\n\n"+ event.name+' is ready for instructors and accomponianst to add availabilities. It will be held on '+date+' at '+startTime+' to '+endTime+' on '+date+' in '+event.location.roomName + '.\n\n'+
          'Please visit performance.oc.edu and add availibilities for this event.\n\nOC Music Department';
        }
        let to = user.dataValues.email;
        console.log('Sending email to: '+to+" from: " +from+" \n"+subject+"\n"+ body);
        sendMail(from, to, "", subject, body)
      }
      })
      res.status(200).send({message: "Emails sent to all active instructors/availabilites for event: "+eventId});
    };


  
// Email all Signed Students for events  

exports.emailSignedUpStudentsForEvent = async (req, res) => {
  const eventId = req.params.id;
  const fromEmail = req.body.fromEmail;
  console.log('Sending email to all signedup students for event: '+eventId+" from: "+fromEmail)
  
  let event;
  let eventSignups;
  // get event data
  await Event.findOne({
    where: { id: eventId }, include : {model : db.location, required : true}}).then((data) => {
      event = data.dataValues;
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving event for event="+eventId,
      });
      return;
    })
  
 if (event.isReady ) {
  // get all active eventSignups
    await EventSignup.findAll({
      where: {
        eventId: event.id,
      },
      include: [
        {
          model: db.studentInstrumentSignup,
          required: true,
          include: {
            model: db.studentInstrument,
            required: true,
            include: {
              model: db.userRole,
              as: "studentRole",
              required: true,
              include: {
                model: db.user,
                required: true,
              },
            },
          },
        },

      ],
    }).then((data) => {

      eventSignups=data;
    
    }).catch((err) => { 
      res.status(500).send({
      message: err.message || "Some error occurred while retrieving eventSignups for event="+eventId,
    });
    return;
    })
     
// send email to all active students
    let from = fromEmail;
    let subject = 'Music Event SigupReminder :' + event.name;
   
    let date = new Date(event.date + " 00:00:00").toLocaleDateString("us-EN");
    let startTime = new Date(event.date + " "+event.startTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
    let endTime = new Date(event.date + " "+event.endTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
    
    eventSignups.forEach((eventSignup) => {
      eventSignup.studentInstrumentSignups.forEach((studentInstrumentSignup) => {
        let user = studentInstrumentSignup.dataValues.studentInstrument.dataValues.studentRole.dataValues.user.dataValues;
          if (user.emailStatus) {
          let time = new Date(event.date + " "+eventSignup.dataValues.startTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
      
          let body=user.firstName+",\n\n"+ "You are signed up to perform at "+event.name+'. You are performing on '+date+' at '+time+' in '+event.location.roomName + '.\n\n'+
      'You can visit performance.oc.edu to check on this event.\n\nOC Music Department';

          let to = user.email;
          console.log('Sending email to: '+to+" from: " +from+" \n"+subject+"\n"+ body);

        sendMail  (from, to, "", subject, body)
        }
      })
    });
    res.status(200).send({message: "Emails sent to all active students for event: "+eventId});
  }
};
// Email all Available Instructors/Accompanist for events
  exports.emailAvailInstAccForEvent = async (req, res) => {
    const eventId = req.params.id;
    const fromEmail = req.body.fromEmail;

    console.log('Sending email to all available Instructors/Accomp for event: '+eventId+" from: "+fromEmail)
    let event;
    let availabilities;
    // get event data
    await Event.findOne({
      where: { id: eventId }, include : {model : db.location, required : true}}).then((data) => {
        event = data.dataValues;
      }).catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving event for event="+eventId,
        });
        return;
      })
  
    // get all active instructors/accompanists
    await Availability.findAll({
      where: {
        eventId: eventId,
      },
      include: {
        model: db.userRole,
        include: [
          {
            model: db.user,
          },
        ],
      },
    })
      .then((data) => {
  
        availabilities = data;
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Something went wrong getting availabilities.",
        });
      });
       
  // send email to all instructors/accompanists with availabilities
      let from = fromEmail;
      let subject = 'Music Event Reminder :' + event.name;
     
      let date = new Date(event.date + " 00:00:00").toLocaleDateString("us-EN");
   
      let body;
      availabilities.forEach((availability) => {
        let startTime = new Date(event.date + " "+availability.dataValues.startTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
        let endTime = new Date(event.date + " "+availability.dataValues.endTime).toLocaleTimeString("us-EN", { hour: "numeric", minute: "2-digit" });
      
        let userRole = availability.dataValues.userRole;
        if (userRole.dataValues.user.emailStatus) {
          body=   userRole.dataValues.user.firstName+",\n\nYou are signed up for "+ event.name+'. The event is on '+date+' and you signed up for '+startTime+' to '+endTime+' at '+event.location.roomName + '.\n\n'+
        'Please visit performance.oc.edu for info on this event.\n\nOC Music Department';
    
          let to = userRole.dataValues.user.email;
          console.log('Sending email to: '+to+" from: " +from+" \n"+subject+"\n"+ body);
          sendMail(from, to, "", subject, body)
        }
      })
      res.status(200).send({message: "Emails sent to all active instructors/availabilites for event: "+eventId});
    };