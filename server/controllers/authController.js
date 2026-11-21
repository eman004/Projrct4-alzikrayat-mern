const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      location: location || '',
      description: description || '',
      occupation: occupation || '',
    });

    await newUser.save();

    const publicProfile = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      location: newUser.location,
      description: newUser.description,
      occupation: newUser.occupation,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: publicProfile,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const publicProfile = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    };

    res.status(200).json({
      message: 'Login successful',
      user: publicProfile,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
