const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {

    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
        telefone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },

    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    tipo_usuario: {
        type: DataTypes.STRING(20),
        allowNull: false
    },

    data_cadastro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;