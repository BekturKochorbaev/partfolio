'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ScientificPublications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      teacherId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      publicationTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      journalName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publicationYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      doi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      indexing: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      orcidId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scopusId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      elibraryId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ScientificPublications');
  }
};
