'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QualificationImprovements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      teacherId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      courseName: Sequelize.STRING,
      organization: Sequelize.STRING,
      completionDate: Sequelize.DATEONLY,
      certificateUrl: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('QualificationImprovements');
  }
};
