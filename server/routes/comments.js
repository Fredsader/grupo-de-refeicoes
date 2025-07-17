const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/meal/:mealId', authMiddleware, async (req, res) =>{
    try{
        const {userId} = req.user;
        const {mealId} = req.params;
        const {comment_text} = req.body;
        console.log({userId});
        console.log({mealId});
        console.log({comment_text})

        const newComment = await pool.query("INSERT INTO coments (meal_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *", [mealId, userId, comment_text]);

        res.status(201).json(newComment.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
})

module.exports = router;