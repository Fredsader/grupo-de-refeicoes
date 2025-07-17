const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require ('../middleware/authMiddleware');


router.use(express.json());
const PORT = 5000;


router.post('/register', async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const saltRounds = 10;
        
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if(user.rows.length > 0){
            return res.status(409).json("Este email já está cadastrado.");
        }

        const password_hash = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3);', [name, email, password_hash]);

        res.status(201).json(newUser.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(500).send("Erro no servidor")
    }
});

router.post('/login', async (req, res) => {
    console.log('Dados recebidos no corpo do /login:', req.body);
    console.log(`Procurando por um usuário com o email: "[${req.body.email}]"`);
   
    try{   
       const { email, password } = req.body;

       const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
       if (result.rows.length === 0){
        return res.status(401).json("Credencial inválido");
       }

       const user = result.rows[0];

       const validPassword = await bcrypt.compare(password, user.password_hash);
       if(!validPassword){
        return res.status(401).json("Credencial inválido");
       }

       const payload = {userId: user.user_id};
       const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

       res.json({token});
    } catch (err){
        console.error(err);
        res.status(500).json({erro: 'Usuário não encontrado'});
    }
});

router.post('/meals', authMiddleware, async (req, res) =>{
    try{
        const userID = req.user.userId;
        const {image_url, description} = req.body;

        const newMeal = await pool.query("INSERT INTO meals (user_id, image_url, description) VALUES ($1, $2, $3) RETURNING *", [userID, image_url, description]);

        res.status(201).json(newMeal.rows[0]);
    }catch (err){
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});


module.exports = router;