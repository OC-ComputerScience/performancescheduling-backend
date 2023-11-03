module.exports = (sequelize, Sequelize) => {
  const Major = sequelize.define("major", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isMusicMajor: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Major;
};
