'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrainingStaff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TrainingStaff.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TrainingStaff',
  });
  return TrainingStaff;
};