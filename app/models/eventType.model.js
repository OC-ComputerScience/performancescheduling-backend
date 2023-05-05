module.exports = (sequelize, Sequelize) => {
  const EventType = sequelize.define("eventType", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slotType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    instrumentType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    defaultSlotDuration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isPrivate: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return EventType;
};
