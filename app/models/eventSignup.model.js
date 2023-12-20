module.exports = (sequelize, Sequelize) => {
  const EventSignup = sequelize.define("eventSignup", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    startTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    endTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    recordingLink: {
      type: Sequelize.STRING,
    },
    pass: {
      type: Sequelize.BOOLEAN,
    },

    isGroupEvent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return EventSignup;
};
