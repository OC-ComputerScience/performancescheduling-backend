module.exports = (sequelize, Sequelize) => {
  const StudentInstrumentEvaluation = sequelize.define(
    "studentInstrumentEvaluation",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      beginningGreatestStrengths: {
        type: Sequelize.STRING,
      },
      beginningTargetedImprovement: {
        type: Sequelize.STRING,
      },
      beginningRecitalHearingDates: {
        type: Sequelize.STRING,
      },
      beginningPerformanceLevelGoal: {
        type: Sequelize.STRING,
      },
      midtermAttendance: {
        type: Sequelize.STRING,
      },
      midtermPreparation: {
        type: Sequelize.STRING,
      },
      midtermGoalProgress: {
        type: Sequelize.STRING,
      },
      midtermAttitude: {
        type: Sequelize.STRING,
      },
      midtermGrade: {
        type: Sequelize.STRING,
      },
      finalAttendance: {
        type: Sequelize.STRING,
      },
      finalPreparation: {
        type: Sequelize.STRING,
      },
      finalGoalProgress: {
        type: Sequelize.STRING,
      },
      finalAttitude: {
        type: Sequelize.STRING,
      },
      finalGrade: {
        type: Sequelize.STRING,
      },
      comments: {
        type: Sequelize.STRING,
      },
    }
  );

  return StudentInstrumentEvaluation;
};
