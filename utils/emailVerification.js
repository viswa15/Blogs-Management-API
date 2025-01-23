import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

export const sendVerificationEmail = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify Your Email',
        text: `Please click the following link to verify your email: ${verificationLink}`,
        html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        user.emailVerificationToken = token;
        user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerificationExpires < Date.now()) {
            throw new Error('Verification token has expired');
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        return user;
    } catch (error) {
        console.error('Error verifying email:', error);
        throw new Error('Invalid or expired verification token');
    }
};