const {DataTypes}=require('sequelize');
const db=require('../config/database');
module.exports=db.define('ManifestacaoDisputaDemo',{
 id_manifestacao:{type:DataTypes.BIGINT,primaryKey:true,autoIncrement:true},
 id_disputa:{type:DataTypes.BIGINT,allowNull:false},
 id_autor:{type:DataTypes.INTEGER,allowNull:false},
 texto:{type:DataTypes.STRING(2000),allowNull:false},
 criada_em:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW}
},{tableName:'manifestacoes_disputa_demo',timestamps:false});
