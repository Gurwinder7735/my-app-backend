'use strict';

const CONSTANTS = require("../constants/constants");


module.exports = {
  async up (queryInterface, Sequelize) {
  
    const roles = Object.values(CONSTANTS.APP.USER_ROLES).map((roleName) => ({
       roleName,
       createdAt: new Date(),
       updatedAt: new Date()
    }));

    console.log(roles,"roles")


    const createdRoles = await queryInterface.bulkInsert('Roles', roles, {});

    const createAdmin = await queryInterface.bulkInsert('Users', [
      {
        email: "admin@admin.com",
        password: "$2b$10$8uSdh3A6O7ONGUFNq0Svnuoddokn5H/H6MOFAP95sdvsy6t8S8doe",
        status: 1,
        firstName: "Admin",
        name: "Admin",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    const createAdminRole = await queryInterface.bulkInsert('UserRoles', [
      {
        roleId: createdRoles,
        userId: createAdmin,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    console.log(createAdmin,"createAdmin")


    
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
