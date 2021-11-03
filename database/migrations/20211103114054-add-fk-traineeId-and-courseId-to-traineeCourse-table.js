'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addConstraint("TraineeCourses", {
        fields: ["traineeId"],
        type: "foreign key",
        name: "custom_fkey_constraint_traineeId",
        references: {
          //Required field
          table: "trainees",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

      await queryInterface.addConstraint("TraineeCourses", {
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
        "TraineeCourses",
        "custom_fkey_constraint_traineeId"
      ),

      await queryInterface.removeConstraint(
        "TraineeCourses",
        "custom_fkey_constraint_courseId"
      ),
    ];
  },
};