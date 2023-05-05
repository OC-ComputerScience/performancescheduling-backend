module.exports = (sequelize, Sequelize) => {
  const UserNotification = sequelize.define("userNotification", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    data: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return UserNotification;
};
