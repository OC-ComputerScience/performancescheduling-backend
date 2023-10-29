const db = require("../models");
const authconfig = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Major = db.major;
const UserRole = db.userRole;
const Session = db.session;

const { google } = require("googleapis");

var jwt = require("jsonwebtoken");

let googleUser = {};

const google_id = process.env.CLIENT_ID;

exports.login = async (req, res) => {
  var googleToken = req.body.credential;

  const { OAuth2Client } = require("google-auth-library");
  const client = new OAuth2Client(google_id);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: google_id,
    });
    googleUser = ticket.getPayload();
  }
  await verify().catch(console.error);

  let email = googleUser.email;
  let firstName = googleUser.given_name;
  let lastName = googleUser.family_name;
  let picture = googleUser.picture;

  let user = {};
  let session = {};

  await User.findOne({
    where: {
      email: email,
    },
  })
    .then(async (data) => {
      if (data != null) {
        // doing this to ensure that the user's name is the one listed with Google
        user = data.dataValues;
        user.firstName = firstName;
        user.lastName = lastName;
        user.picture = picture;
        await User.update(user, {
          where: { id: user.id },
        })
          .then((num) => {
            if (num == 1) {
              console.log("updated user's name");
            } else {
              console.log(
                `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`
              );
            }
          })
          .catch((err) => {
            console.log("Error updating User with id=" + user.id + " " + err);
          });

        await UserRole.findAll({
          where: { userId: user.id, status: "Active" },
          include: [{
            model: Role,
          },
          {model: User},
          {model: Major}
        ]})
          .then((data) => {
            user.roles = data;
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        // create a new User and save to database
        user = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          picture: picture,
          authenticationType: "OC",
          status: "Active",
        };

        await User.create(user)
          .then((data) => {
            user = data.dataValues;
          })
          .catch((err) => {
            console.log(err);
          });

        var userRole = {
          userId: user.id,
          status: "Active",
        };

        if (email.includes("@eagles.oc.edu")) {
          userRole.roleId = 1;
        } else if (email.includes("@oc.edu")) {
          userRole.roleId = 2;
        }

        await UserRole.create(userRole).catch((err) => {
          console.log(err.message);
        });
        await UserRole.findAll({
          where: { userId: user.id, status: "Active" },
          include: [
            {model: User},
            {model: Role}
          ],
        })
          .then((data) => {
            user.roles = data;
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

  await Session.findOne({
    where: {
      email: email,
      token: googleToken,
    },
  })
    .then(async (data) => {
      if (data !== null) {
        session = data.dataValues;
        if (session.expirationDate < Date.now()) {
          session.token = "";
          // clear session's token if it's expired
          await Session.update(session, { where: { id: session.id } })
            .then((num) => {
              if (num == 1) {
                console.log("successfully logged out");
              } else {
                console.log("failed");
                res.send({
                  message: `Error logging out user.`,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message: "Error logging out user.",
              });
            });
          //reset session to be null since we need to make another one
          session = {};
        } else {
          // if the session is still valid, then send info to the front end
          let userInfo = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user.id,
            token: session.token,
            role: user.roles,
          };
          res.send(userInfo);
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions.",
      });
    });

  if (session.id === undefined) {
    // create a new Session with an expiration date and save to database
    let token = jwt.sign({ id: email }, authconfig.secret, {
      expiresIn: 86400,
    });
    let tempExpirationDate = new Date();
    tempExpirationDate.setDate(tempExpirationDate.getDate() + 1);
    const session = {
      token: token,
      email: email,
      userId: user.id,
      expirationDate: tempExpirationDate,
    };

    await Session.create(session)
      .then(() => {
        let userInfo = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          userId: user.id,
          token: token,
          roles: user.roles,
          // refresh_token: user.refresh_token,
          // expiration_date: user.expiration_date
        };
        res.send(userInfo);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.authorize = async (req, res) => {
  console.log("authorize client");
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "postmessage"
  );

  console.log("authorize token");
  // Get access and refresh tokens (if access_type is offline)
  let { tokens } = await oauth2Client.getToken(req.body.code);
  oauth2Client.setCredentials(tokens);

  let user = {};
  console.log("findUser");

  await User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data != null) {
        user = data.dataValues;
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
      return;
    });
  console.log("user");
  console.log(user);
  user.refresh_token = tokens.refresh_token;
  let tempExpirationDate = new Date();
  tempExpirationDate.setDate(tempExpirationDate.getDate() + 100);
  user.expiration_date = tempExpirationDate;

  await User.update(user, { where: { id: user.id } })
    .then((num) => {
      if (num == 1) {
        console.log("updated user's google token stuff");
      } else {
        console.log(
          `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`
        );
      }
      let userInfo = {
        refresh_token: user.refresh_token,
        expiration_date: user.expiration_date,
      };
      console.log(userInfo);
      res.send(userInfo);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

  console.log(tokens);
  console.log(oauth2Client);
};

exports.logout = async (req, res) => {
  console.log(req.body);
  if (req.body === null) {
    res.send({
      message: "User has already been successfully logged out!",
    });
    return;
  }

  // invalidate session -- delete token out of session table
  let session = {};

  await Session.findAll({ where: { token: req.body.token } })
    .then((data) => {
      if (data[0] !== undefined) session = data[0].dataValues;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions.",
      });
      return;
    });

  session.token = "";

  // session won't be null but the id will if no session was found
  if (session.id !== undefined) {
    Session.update(session, { where: { id: session.id } })
      .then((num) => {
        if (num == 1) {
          console.log("successfully logged out");
          res.send({
            message: "User has been successfully logged out!",
          });
        } else {
          console.log("failed");
          res.send({
            message: `Error logging out user.`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error logging out user.",
        });
      });
  } else {
    console.log("already logged out");
    res.send({
      message: "User has already been successfully logged out!",
    });
  }
};
