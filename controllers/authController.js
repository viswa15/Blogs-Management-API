import User  from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/emailService.js';
import { verifyEmail as verifyEmailUtil } from '../utils/emailVerification.js';
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        await sendVerificationEmail(newUser);

        res.status(201).json({ message: 'User registered successfully. Please check your email to verify it.' });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Email not verified. Please check your email to verify it.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'User logged in successfully', token, user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await verifyEmailUtil(String(token));
        res.json({ message: 'Email verified successfully', user });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).json({ message: error.message });
    }

};