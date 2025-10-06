const db = require('./models');

(async () => {
  try {
    await db.sequelize.sync({ alter: true }); // или force: true
    console.log("✅ Все таблицы успешно синхронизированы");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при синхронизации:", error);
    process.exit(1);
  }
})();
