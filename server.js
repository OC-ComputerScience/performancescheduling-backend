require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./app/models");

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./app/routes/auth.routes.js")(app);
require("./app/routes/availability.routes.js")(app);
require("./app/routes/composer.routes.js")(app);
require("./app/routes/critique.routes.js")(app);
require("./app/routes/event.routes.js")(app);
require("./app/routes/eventSignup.routes.js")(app);
require("./app/routes/eventSignupPiece.routes.js")(app);
require("./app/routes/eventType.routes.js")(app);
require("./app/routes/instrument.routes.js")(app);
require("./app/routes/level.routes.js")(app);
require("./app/routes/location.routes.js")(app);
require("./app/routes/major.routes.js")(app);
require("./app/routes/notification.routes.js")(app);
require("./app/routes/piece.routes.js")(app);
require("./app/routes/role.routes.js")(app);
require("./app/routes/semester.routes.js")(app);
require("./app/routes/studentInstrument.routes.js")(app);
require("./app/routes/studentInstrumentEvaluation.routes.js")(app);
require("./app/routes/studentInstrumentSignup.routes.js")(app);
require("./app/routes/studentPiece.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/userNotification.routes.js")(app);
require("./app/routes/userRole.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3028;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
