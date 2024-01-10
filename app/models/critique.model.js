module.exports = (sequelize, Sequelize) => {
  const Critique = sequelize.define("critique", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    accuracyComment: {
      type: Sequelize.STRING(600),
    },
    accuracyGrade: {
      type: Sequelize.STRING,
    },
    balanceComment: {
      type: Sequelize.STRING(600),
    },
    balanceGrade: {
      type: Sequelize.STRING,
    },
    deportmentComment: {
      type: Sequelize.STRING(600),
    },
    deportmentGrade: {
      type: Sequelize.STRING,
    },
    dictionComment: {
      type: Sequelize.STRING(600),
    },
    dictionGrade: {
      type: Sequelize.STRING,
    },
    interpretationComment: {
      type: Sequelize.STRING(600),
    },
    interpretationGrade: {
      type: Sequelize.STRING,
    },
    toneComment: {
      type: Sequelize.STRING(600),
    },
    toneGrade: {
      type: Sequelize.STRING,
    },
    overallComment: {
      type: Sequelize.STRING(1500),
      allowNull: false,
    },
  });

  return Critique;
};
