module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("event", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    endTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    isReady: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return Event;
};
