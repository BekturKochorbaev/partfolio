const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeachingInfo = sequelize.define('TeachingInfo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subjects: DataTypes.ARRAY(DataTypes.STRING),
  methodology: DataTypes.TEXT,
  technologies: DataTypes.TEXT,
  programs: DataTypes.TEXT
});

module.exports = TeachingInfo;
