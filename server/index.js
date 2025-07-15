const bcrypt = require('bcrypt');

const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('O coração do nosso site está batendo!');
});

app.send

app.listen(PORT, () => {
    console.log(`O servidor rodando na porta ${PORT}`);
});