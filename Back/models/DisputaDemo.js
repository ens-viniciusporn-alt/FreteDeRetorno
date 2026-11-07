const {DataTypes}=require('sequelize');
const db=require('../config/database');
module.exports=db.define('DisputaDemo',{
  id_disputa:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
  id_contrato:{type:DataTypes.BIGINT,allowNull:false,unique:true},
  situacao:{type:DataTypes.STRING(24),allowNull:false,defaultValue:'ABERTA'},
  solicitacao_admin:{type:DataTypes.STRING(1000)},
  decisao:{type:DataTypes.STRING(30)},
  justificativa_decisao:{type:DataTypes.STRING(1500)},
  resolvida_por:{type:DataTypes.INTEGER},
  aberta_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
  resolvida_em:{type:DataTypes.DATE},
  atualizado_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW}
},{tableName:'disputas_frete_demo',timestamps:false});
