const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

app.get('/usuarios', (req, res) => {
    res.send('Lista de usuários');
});