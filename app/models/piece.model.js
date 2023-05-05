module.exports = (sequelize, Sequelize) => {
  const Piece = sequelize.define("piece", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    originalLanguage: {
      type: Sequelize.STRING,
    },
    originalLyrics: {
      type: Sequelize.STRING,
    },
    poeticTranslation: {
      type: Sequelize.STRING,
    },
    literalTranslation: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Piece;
};
