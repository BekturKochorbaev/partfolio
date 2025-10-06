'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GrantParticipations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      teacherId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      projectName: Sequelize.STRING,
      role: Sequelize.STRING,
      organization: Sequelize.STRING,
      startDate: Sequelize.DATEONLY,
      endDate: Sequelize.DATEONLY,
      status: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('GrantParticipations');
  }
};
