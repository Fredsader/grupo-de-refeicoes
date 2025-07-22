const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) =>{
    try{
        const {userId} = req.user;
        const {image_url, description} = req.body;

        const newMeal = await pool.query("INSERT INTO meals (user_id, image_url, description) VALUES ($1, $2, $3) RETURNING *", [userId, image_url, description]);

        res.status(201).json(newMeal.rows[0]);
    }catch (err){
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});

router.get('/:mealId', async (req, res) => {
    const {mealId} = req.params;
    console.log({mealId});
    const meal = await pool.query("SELECT * FROM meals WHERE meal_id = ($1) ORDER BY created_at DESC ", [mealId]);

    res.status(200).json(meal.rows[0]);
})

router.get('/', async (req, res) => {
    try {
      const meals = await pool.query("SELECT * FROM meals ORDER BY created_at DESC");
      res.status(200).json(meals.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erro no servidor");
    }
  });



module.exports = router;