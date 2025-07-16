const bcrypt = require('bcrypt');

const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json);
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('O coração do nosso site está batendo!');
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err){
            console.error('Erro ao gerar hash:', err);
            return;
        }

        console.log('hash herado:', hash);
    });

    pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3);', [name, email, password]);
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    try{   
       const result = pool.query('SELECT FROM users WHERE email = $1', [email]);

        bcrypt.compare(password, result.rows[0].password_hash);


    } catch (err){
        console.error(err);
        res.status(500).json({erro: 'Usuário não encontrado'});
    }
});

app.listen(PORT, () => {
    console.log(`O servidor rodando na porta ${PORT}`);
});