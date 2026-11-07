const {DataTypes}=require('sequelize');
const sequelize=require('../config/database');
module.exports=sequelize.define('MensagemDemo',{
  id_mensagem:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
  id_conversa:{type:DataTypes.BIGINT,allowNull:false},
  id_autor:{type:DataTypes.INTEGER,allowNull:false},
  texto:{type:DataTypes.STRING(1000),allowNull:false},
  criada_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW}
},{tableName:'mensagens_frete_demo',timestamps:false});
