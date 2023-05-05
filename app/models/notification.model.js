module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notification", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Notification;
};
