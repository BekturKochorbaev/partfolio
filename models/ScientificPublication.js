const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScientificPublication = sequelize.define('ScientificPublication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  publicationTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Название публикации не может быть пустым.' },
    },
  },
  journalName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Название журнала обязательно.' },
    },
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Год публикации должен быть числом.' },
      min: {
        args: 1900,
        msg: 'Год публикации не может быть раньше 1900.',
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Год публикации не может быть позже ${new Date().getFullYear()}.`,
      },
    },
  },
  doi: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'DOI не должен превышать 255 символов.',
      },
    },
  },
  indexing: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orcidId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  scopusId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  elibraryId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'ScientificPublications',
  timestamps: true,
});

module.exports = ScientificPublication;
