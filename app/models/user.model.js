module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    honorific: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    authenticationType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    picture: {
      type: Sequelize.STRING,
    },
    emailStatus: {
      type: Sequelize.BOOLEAN,
    },
    textStatus: {
      type: Sequelize.BOOLEAN,
    },
    googleToken: {
      type: Sequelize.STRING(512),
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return User;
};
