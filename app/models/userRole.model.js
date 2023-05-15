module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define("userRole", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    studentClassification: {
      type: Sequelize.STRING,
    },
    studentLessonHours: {
      type: Sequelize.INTEGER,
    },
    studentSemesters: {
      type: Sequelize.INTEGER,
    },
    facultyType: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return UserRole;
};
