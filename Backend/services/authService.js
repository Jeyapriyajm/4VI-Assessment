import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';  

import { connectDB } from '../db.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register User
export const registerUser = async (user) => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create a new user and save it to the database
        const newUser = new UserModel({
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            password: hashedPassword,
        });

        await newUser.save();

        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Registration failed. Please try again later.' };
    }
};

// Login User with JWT token
export const loginUser = async (email, password) => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { success: false, message: 'Incorrect password' };
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, name: user.username }  
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed. Please try again later.' };
    }
};



export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; 
        next();
    });
};
