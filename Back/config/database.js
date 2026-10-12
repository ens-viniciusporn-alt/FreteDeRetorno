require('dotenv').config();
const { Sequelize } = require('sequelize');

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Configuração ausente: ${missing.join(', ')}. Confira Back/.env`);
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.DB_SSL === 'false' ? {} : {
    ssl: { rejectUnauthorized: true }
  },
  pool: { max: 5, min: 0, idle: 10000, acquire: 20000 },
});
module.exports = sequelize;
