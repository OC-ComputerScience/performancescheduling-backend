module.exports = (sequelize, Sequelize) => {
  const StudentInstrumentSignup = sequelize.define("studentInstrumentSignup", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
  });

  return StudentInstrumentSignup;
};
