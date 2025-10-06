const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GalleryItem = sequelize.define('GalleryItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  filePath: DataTypes.STRING,
  type: DataTypes.STRING // 'image' или 'video'
});

module.exports = GalleryItem;
