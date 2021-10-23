'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrainerCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TrainerCourse.belongsTo(models.trainer, {
        foreignKey: 'trainerId',
        onDelete: 'CASCADE'
      })

      TrainerCourse.belongsTo(models.course, {
        foreignKey: 'courseId',
        onDelete: 'CASCADE'
      })
    }
  };
  TrainerCourse.init({
    trainerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TrainerCourse',
  });
  return TrainerCourse;
};