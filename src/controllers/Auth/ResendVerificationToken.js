import sendResponse from '../../helpers/sendResponse.js';
import baseUser from '../../models/NewUser.model.js';
import nodemailer from 'nodemailer';

export const resendVerificationToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await baseUser.findOne({ email });
        if (!user) {
            return sendResponse(res, 404, null, true, 'User not found');
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return sendResponse(res, 400, null, true, 'User is already verified');
        }

        // Generate a new verification token
        const verificationToken = user.createVerificationToken();
        await user.save();

        // Send the new verification token via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Resend Email Verification Token',
            text: `Please verify your email using this token: ${verificationToken}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification token resent successfully. Please check your email.' });
    } catch (error) {
        console.error('Resend Token Error:', error);
        res.status(500).json({ error: 'Something went wrong while resending the token' });
    }
};