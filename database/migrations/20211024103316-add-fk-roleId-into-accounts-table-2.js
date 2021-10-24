"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Accounts", {
      fields: ["roleId"],
      type: "foreign key",
      name: "custom_fkey_constraint_roleId_2",
      references: {
        //Required field
        table: "Roles",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "Accounts",
      "custom_fkey_constraint_roleId_2"
    );
  },
};