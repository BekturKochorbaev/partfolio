const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PublishedTextbook = sequelize.define('PublishedTextbook', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coAuthors: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // ✅ Новое поле: Изданные УП под грифом МОиН
  moeTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Массив PDF-файлов
  files: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = PublishedTextbook;
