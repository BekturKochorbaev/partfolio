'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExpertActivities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      teacherId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      eventName: Sequelize.STRING,
      role: Sequelize.STRING,
      participationDate: Sequelize.DATEONLY,
      organizer: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ExpertActivities');
  }
};
