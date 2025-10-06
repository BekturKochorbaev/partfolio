const { Sequelize } = require('sequelize');
require('dotenv').config(); // 👈 Обязательно для загрузки .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, // пароль к базе данных
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log,
  }
);

module.exports = sequelize;
