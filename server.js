const express = require('express');
const path = require('path');

const sequelize = require('./config/database');


const usuarioRoutes = require('./routes/usuarioRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();

const PORT = 3000;

app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/login', loginRoutes);

// Disponibiliza os arquivos do site
app.use(express.static(__dirname));

// Testa a conexão com o PostgreSQL
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o PostgreSQL realizada com sucesso!');
    })
    .catch((erro) => {
        console.error('Erro ao conectar com o PostgreSQL:', erro.message);
    });


app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});