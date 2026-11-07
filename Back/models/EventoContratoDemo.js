const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
module.exports = sequelize.define('EventoContratoDemo', {
  id_evento: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  id_contrato: { type: DataTypes.BIGINT, allowNull: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  acao: { type: DataTypes.STRING(40), allowNull: false },
  estado_anterior: { type: DataTypes.STRING(24) },
  estado_novo: { type: DataTypes.STRING(24), allowNull: false },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'eventos_contrato_demo', timestamps: false });
