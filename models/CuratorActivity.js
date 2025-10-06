const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CuratorActivity = sequelize.define('CuratorActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  groupName: DataTypes.STRING,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  achievements: DataTypes.TEXT, // Основные достижения

  // ✅ путь(и) к изображениям: теперь массив
  imagePaths: {
    type: DataTypes.TEXT,
    get() {
      const raw = this.getDataValue('imagePaths');
      return raw ? JSON.parse(raw) : [];
    },
    set(value) {
      this.setDataValue('imagePaths', JSON.stringify(value));
    }
  }
}, {
  timestamps: true,
});

module.exports = CuratorActivity;
