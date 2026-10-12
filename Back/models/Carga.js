const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Carga = sequelize.define('Carga', {
  id_carga:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
  id_cliente:{type:DataTypes.INTEGER,allowNull:false},
  origem:{type:DataTypes.STRING(120),allowNull:false},
  destino:{type:DataTypes.STRING(120),allowNull:false},
  descricao:{type:DataTypes.STRING(300),allowNull:false},
  volume_m3:{type:DataTypes.DECIMAL(10,2),allowNull:false},
  status:{type:DataTypes.STRING(20),allowNull:false,defaultValue:'ABERTA'},
  criada_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
},{tableName:'cargas',timestamps:false});
module.exports = Carga;
