module.exports = (sequelize, Sequelize) => {
  const EventSignupPiece = sequelize.define("eventSignupPiece", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
  });

  return EventSignupPiece;
};
