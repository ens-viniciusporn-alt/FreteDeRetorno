const {DataTypes}=require('sequelize');
const db=require('../config/database');
module.exports=db.define('AcaoAdminDisputaDemo',{
 id_acao:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
 id_disputa:{type:DataTypes.BIGINT,allowNull:false},
 id_admin:{type:DataTypes.INTEGER,allowNull:false},
 acao:{type:DataTypes.STRING(30),allowNull:false},
 justificativa:{type:DataTypes.STRING(1500),allowNull:false},
 criada_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW}
},{tableName:'acoes_admin_disputa_demo',timestamps:false});
