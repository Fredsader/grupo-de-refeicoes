const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:mealId', authMiddleware, async (req, res) => {
    try{
        const {mealId} = req.params;
        const {userId} = req.user;
        const {stars} = req.body;

        const newRating = await pool.query("INSERT INTO ratings (meal_id, user_id, stars) VALUES ($1, $2, $3) ON CONFLICT (meal_id, user_id) DO UPDATE SET stars = EXCLUDED.stars RETURNING *", [mealId, userId, stars]);
        res.status(200).json(newRating.rows);   
    }catch (err){
        console.error(err.message);
        res.status(500).send("Erro no Servidor");    
    }
});

router.get('/meals/:mealId', async (req, res) =>{
    try{
        const {mealId} = req.params;
        console.log({mealId});

        const avgMealRating = await pool.query("SELECT COALESCE (AVG(stars) ::numeric(10,2), 0.00) AS average_rating, COUNT(rating_id) AS total_votes FROM ratings WHERE meal_id = $1", [mealId]);

        res.status(200).json(avgMealRating.rows);
    }catch (err){
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});

router.get('/users/:userId', async (req, res) =>{
    try{
        const {userId} = req.params;
        console.log({userId});

        const avgUserRating = await pool.query("SELECT COALESCE (AVG(r.stars) ::numeric(10,2), 0.00) AS overall_average_rating, COUNT(r.rating_id) AS total_votes FROM ratings r JOIN meals m ON r.meal_id = m.meal_id WHERE m.user_id = $1", [userId]);

        res.status(200).json(avgUserRating.rows);
    }catch (err){
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});
module.exports = router;