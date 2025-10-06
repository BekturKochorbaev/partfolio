const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PersonalInfo = sequelize.define('PersonalInfo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  diploma: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  workplace: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: true
  },
  academicTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dissertations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trainingCourses: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  retraining: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  awards: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  researchArea: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  total_experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  teaching_experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mnu_experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  interests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // 🆕 ДОБАВЛЯЕМ ТУТ
  orcidId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  scopusId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  elibraryId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = PersonalInfo;
