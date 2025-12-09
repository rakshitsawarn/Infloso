const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }     
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }       
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,           
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    console.log("Refresh token request received");
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    console.log(refreshToken);
    


    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.email !== decoded.email) return res.sendStatus(403);

        const accessToken = createAccessToken(user);
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); 


    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
