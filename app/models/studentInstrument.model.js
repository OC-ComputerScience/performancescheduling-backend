module.exports = (sequelize, Sequelize) => {
  const StudentInstrument = sequelize.define("studentInstrument", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return StudentInstrument;
};
