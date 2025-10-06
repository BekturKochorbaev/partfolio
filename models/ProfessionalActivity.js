const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfessionalActivity = sequelize.define('ProfessionalActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  activityType: DataTypes.STRING, // Совет, комиссия, грант и т.д.
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  organization: DataTypes.STRING,
  date: DataTypes.DATEONLY
});

module.exports = ProfessionalActivity;
