const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
module.exports = sequelize.define('PasswordReset', {
  id: {type:DataTypes.BIGINT, primaryKey:true, autoIncrement:true},
  usuario_id: {type:DataTypes.INTEGER,allowNull:false},
  token_hash: {type:DataTypes.STRING(64),allowNull:false},
  expira_em: {type:DataTypes.DATE,allowNull:false},
  usado_em: {type:DataTypes.DATE,allowNull:true},
}, {tableName:'tokens_recuperacao',timestamps:false});
