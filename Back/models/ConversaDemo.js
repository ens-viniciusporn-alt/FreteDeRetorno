const {DataTypes}=require('sequelize');
const sequelize=require('../config/database');
module.exports=sequelize.define('ConversaDemo',{
  id_conversa:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
  id_carga:{type:DataTypes.BIGINT,allowNull:false},
  id_cliente:{type:DataTypes.INTEGER,allowNull:false},
  id_transportador:{type:DataTypes.INTEGER,allowNull:false},
  criada_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW}
},{tableName:'conversas_frete_demo',timestamps:false});
