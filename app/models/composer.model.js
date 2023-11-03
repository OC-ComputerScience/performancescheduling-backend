module.exports = (sequelize, Sequelize) => {
  const Composer = sequelize.define("composer", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    nationality: {
      type: Sequelize.STRING,
    },
    dateOfBirth: {
      type: Sequelize.STRING,
    },
    dateOfDeath: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Composer;
};
