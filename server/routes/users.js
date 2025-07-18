const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/", async (req, res) =>{
  try{
    const users = await pool.query("SELECT user_id, name FROM users")
    res.status(200).json(users.rows);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

router.get("/:userId/meals", async (req, res) =>{
    try{
        const {userId} = req.params;
        const user_meals = await pool.query("SELECT * FROM meals WHERE user_id = ($1) ORDER BY created_at DESC", [userId]);
        res.status(200).json(user_meals.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});

module.exports = router;