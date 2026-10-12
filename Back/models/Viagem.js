const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Viagem = sequelize.define('Viagem', {
  id_viagem:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
  id_transportador:{type:DataTypes.INTEGER,allowNull:false},
  origem:{type:DataTypes.STRING(120),allowNull:false},
  destino:{type:DataTypes.STRING(120),allowNull:false},
  data_saida:{type:DataTypes.DATEONLY,allowNull:false},
  veiculo:{type:DataTypes.STRING(80),allowNull:false},
  capacidade_m3:{type:DataTypes.DECIMAL(10,2),allowNull:false},
  status:{type:DataTypes.STRING(20),allowNull:false,defaultValue:'AGENDADA'},
  criada_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
},{tableName:'viagens',timestamps:false});
module.exports = Viagem;
