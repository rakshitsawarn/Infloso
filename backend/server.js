const dotenv = require("dotenv");
const express = require("express");

const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,              
}));

app.use('/api/auth', authRoutes);

const { verifyAccessToken } = require('./middleware/authMiddleware');
app.get('/api/me', verifyAccessToken, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
