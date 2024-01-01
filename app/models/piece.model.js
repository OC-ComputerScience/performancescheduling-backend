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
      type: Sequelize.STRING(1000),
    },
    poeticTranslation: {
      type: Sequelize.STRING(1000),
    },
    literalTranslation: {
      type: Sequelize.STRING(5000),
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Piece;
};
