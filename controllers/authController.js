const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, SpaOrganization } = require('../models');
const emailService = require('../services/emailService');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate Token
        const token = jwt.sign(
            {
                userId: user.UserId,
                email: user.Email,
                role: user.Role,
                spaId: user.SpaId
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.UserId,
                email: user.Email,
                fullName: user.FullName,
                role: user.Role,
                spaId: user.SpaId
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.register = async (req, res) => {
    // Basic registration for testing/admin creation
    try {
        const { email, password, fullName, role, spaId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            Email: email,
            PasswordHash: hashedPassword,
            PlainPassword: password, // Store plain password for admin recovery
            FullName: fullName,
            Role: role || 'Customer',
            SpaId: spaId
        });

        res.status(201).json({ message: 'User registered successfully.', userId: newUser.UserId });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Forgot Password - Request reset token
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: 'If an account exists with this email, a password reset code has been sent.' });
        }

        // Generate 6-digit reset token
        const resetToken = crypto.randomInt(100000, 999999).toString();

        // Set token and expiry (15 minutes)
        user.ResetPasswordToken = resetToken;
        user.ResetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        // Check if email is configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('⚠️ Email not configured. Reset token:', resetToken);
            console.log('⚠️ For user:', email);
            return res.json({
                message: 'Email service not configured. Please contact administrator.',
                // In development, return the token (REMOVE IN PRODUCTION!)
                resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
            });
        }

        // Send email
        try {
            await emailService.sendPasswordResetEmail(email, resetToken, user.FullName);
            res.json({ message: 'If an account exists with this email, a password reset code has been sent.' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            console.log('⚠️ Reset token for', email, ':', resetToken);
            res.status(500).json({
                message: 'Failed to send reset email. Please try again later.',
                // In development, return the token (REMOVE IN PRODUCTION!)
                resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
            });
        }

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Reset Password - Verify token and update password
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid reset request.' });
        }

        // Check if token matches and hasn't expired
        if (user.ResetPasswordToken !== resetToken) {
            return res.status(400).json({ message: 'Invalid reset code.' });
        }

        if (!user.ResetPasswordExpires || new Date() > user.ResetPasswordExpires) {
            return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.PasswordHash = hashedPassword;
        user.PlainPassword = newPassword; // Update plain password too
        user.ResetPasswordToken = null;
        user.ResetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
