'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PublishedTextbooks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      teacherId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      title: Sequelize.STRING,
      coAuthors: Sequelize.STRING,
      year: Sequelize.INTEGER,
      publisher: Sequelize.STRING,
      isbn: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('PublishedTextbooks');
  }
};
