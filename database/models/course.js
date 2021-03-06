'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      course.belongsTo(models.courseCategory, {
        foreignKey: 'courseCategoryId',
        onDelete: 'cascade'
      })

      course.hasMany(models.TrainerCourse, {
        foreignKey: 'courseId',
        as: 'courseId'
      })
    }
  };
  course.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    courseCategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'course',
  });
  return course;
};