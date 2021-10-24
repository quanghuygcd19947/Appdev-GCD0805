'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addConstraint("TrainerCourses", {
        fields: ["trainerId"],
        type: "foreign key",
        name: "custom_fkey_constraint_trainerId",
        references: {
          //Required field
          table: "trainers",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

      await queryInterface.addConstraint("TrainerCourses", {
        fields: ["courseId"],
        type: "foreign key",
        name: "custom_fkey_constraint_courseId",
        references: {
          //Required field
          table: "courses",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeConstraint(
        "TrainerCourses",
        "custom_fkey_constraint_trainerId"
      ),

      await queryInterface.removeConstraint(
        "TrainerCourses",
        "custom_fkey_constraint_courseId"
      ),
    ];
  },
};