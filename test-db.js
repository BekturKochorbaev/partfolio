// test-db.js
const { Sequelize } = require('sequelize');

// Подключаемся с параметрами из config.json
const sequelize = new Sequelize('teacher_portfolio', 'postgres', '12345678', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных успешно установлено!');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
  } finally {
    await sequelize.close();
  }
})();
