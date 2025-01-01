import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
  const { username, email, mobile, password } = req.body;

  if (!username || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ username, email, mobile, password: hashedPassword });
    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Login user
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
