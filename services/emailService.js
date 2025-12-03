const nodemailer = require('nodemailer');

// Create transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetToken, userName) => {
    const mailOptions = {
        from: `"The Stoneage Spa" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - The Stoneage Spa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: #2E1A47; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: #D4AF37; margin: 0;">The Stoneage Spa</h1>
                </div>
                <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #2E1A47;">Password Reset Request</h2>
                    <p>Hello ${userName},</p>
                    <p>We received a request to reset your password. Use the code below to reset your password:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                        <h1 style="color: #2E1A47; letter-spacing: 5px; margin: 0; font-size: 36px;">${resetToken}</h1>
                    </div>
                    <p>This code will expire in <strong>15 minutes</strong>.</p>
                    <p>If you didn't request a password reset, please ignore this email or contact us if you have concerns.</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email service is ready');
        return true;
    } catch (error) {
        console.error('❌ Email service configuration error:', error);
        return false;
    }
};
