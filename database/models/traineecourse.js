'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TraineeCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TraineeCourse.belongsTo(models.trainee, {
        foreignKey: 'traineeId',
        onDelete: 'CASCADE'
      })

      TraineeCourse.belongsTo(models.course, {
        foreignKey: 'courseId',
        onDelete: 'CASCADE'
      })
    }
  };
  TraineeCourse.init({
    traineeId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'TraineeCourse',
  });
  return TraineeCourse;
};