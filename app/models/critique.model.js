module.exports = (sequelize, Sequelize) => {
  const Critique = sequelize.define("critique", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    accuracyComment: {
      type: Sequelize.STRING,
    },
    accuracyGrade: {
      type: Sequelize.STRING,
    },
    balanceComment: {
      type: Sequelize.STRING,
    },
    balanceGrade: {
      type: Sequelize.STRING,
    },
    deportmentComment: {
      type: Sequelize.STRING,
    },
    deportmentGrade: {
      type: Sequelize.STRING,
    },
    dictionComment: {
      type: Sequelize.STRING,
    },
    dictionGrade: {
      type: Sequelize.STRING,
    },
    interpretationComment: {
      type: Sequelize.STRING,
    },
    interpretationGrade: {
      type: Sequelize.STRING,
    },
    toneComment: {
      type: Sequelize.STRING,
    },
    toneGrade: {
      type: Sequelize.STRING,
    },
    overallComment: {
      type: Sequelize.STRING,
    },
  });

  return Critique;
};
