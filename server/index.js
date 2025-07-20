const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const mealsRoutes = require('./routes/meals');
app.use('/api/meals', mealsRoutes);

const commentsRoutes = require('./routes/comments');
app.use('/api/comments', commentsRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const ratingsRoutes = require('./routes/ratings');
app.use('/api/ratings', ratingsRoutes);

app.get('/', (req, res) => {
res.send('O coração do nosso site está batendo!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});