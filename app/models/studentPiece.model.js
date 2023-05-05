module.exports = (sequelize, Sequelize) => {
  const StudentPiece = sequelize.define("studentPiece", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return StudentPiece;
};
