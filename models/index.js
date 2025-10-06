const User = require('./User');
const PersonalInfo = require('./PersonalInfo');
const TeachingInfo = require('./TeachingInfo');
const StudentAchievement = require('./StudentAchievement');
const TeacherAchievement = require('./TeacherAchievement');
const StudentMentorship = require('./StudentMentorship');
const ProfessionalActivity = require('./ProfessionalActivity');
const Gallery = require('./Gallery');
const AcademicMobility = require('./AcademicMobility');
const QualificationImprovement = require('./QualificationImprovement');
const MethodicalMaterial = require('./MethodicalMaterial');
const PublishedTextbook = require('./PublishedTextbook');
const ScientificPublication = require('./ScientificPublication');
const GrantParticipation = require('./GrantParticipation');
const CuratorActivity = require('./CuratorActivity');
const ExpertActivity = require('./ExpertActivity');

// 🔽 Ассоциации между User и PersonalInfo
User.hasOne(PersonalInfo, {
  foreignKey: 'teacherId',
  as: 'personalInfo',
  onDelete: 'CASCADE',
  hooks: true
});
PersonalInfo.belongsTo(User, {
  foreignKey: 'teacherId',
  as: 'user'
});

// 🔽 TeachingInfo
User.hasOne(TeachingInfo, {
  foreignKey: 'teacherId',
  onDelete: 'CASCADE',
  hooks: true
});
TeachingInfo.belongsTo(User, {
  foreignKey: 'teacherId'
});

PersonalInfo.hasOne(TeachingInfo, {
  foreignKey: 'teacherId',
  sourceKey: 'teacherId',
  onDelete: 'CASCADE',
  hooks: true
});
TeachingInfo.belongsTo(PersonalInfo, {
  foreignKey: 'teacherId',
  targetKey: 'teacherId'
});

// 🔽 Остальные связи с каскадным удалением
const relatedModels = [
  StudentAchievement,
  TeacherAchievement,
  StudentMentorship,
  ProfessionalActivity,
  Gallery,
  AcademicMobility,
  QualificationImprovement,
  MethodicalMaterial,
  PublishedTextbook,
  ScientificPublication,
  GrantParticipation,
  CuratorActivity,
  ExpertActivity
];

relatedModels.forEach((model) => {
  User.hasMany(model, {
    foreignKey: 'teacherId',
    onDelete: 'CASCADE',
    hooks: true
  });
  model.belongsTo(User, {
    foreignKey: 'teacherId'
  });
});

module.exports = {
  User,
  PersonalInfo,
  TeachingInfo,
  StudentAchievement,
  TeacherAchievement,
  StudentMentorship,
  ProfessionalActivity,
  Gallery,
  AcademicMobility,
  QualificationImprovement,
  MethodicalMaterial,
  PublishedTextbook,
  ScientificPublication,
  GrantParticipation,
  CuratorActivity,
  ExpertActivity
};
