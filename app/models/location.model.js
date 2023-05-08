module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define("location", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    roomName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomNumber: {
      type: Sequelize.STRING,
    },
    building: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Location;
};
