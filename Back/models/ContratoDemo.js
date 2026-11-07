const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ContratoDemo = sequelize.define('ContratoDemo', {
  id_contrato: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  id_carga: { type: DataTypes.BIGINT, allowNull: false },
  id_viagem: { type: DataTypes.BIGINT, allowNull: false },
  id_cliente: { type: DataTypes.INTEGER, allowNull: false },
  id_transportador: { type: DataTypes.INTEGER, allowNull: false },
  valor_centavos: { type: DataTypes.BIGINT, allowNull: false },
  status: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'PROPOSTO' },
  descricao_acordo: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  aceito_em: { type: DataTypes.DATE, allowNull: true },
  metodo_pagamento_demo: { type: DataTypes.STRING(12), allowNull: true },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  atualizado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'contratos_frete_demo', timestamps: false });
module.exports = ContratoDemo;
