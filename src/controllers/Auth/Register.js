import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '../../models/User.model.js';

export const registerUser = async (req, res) => {
    try {
        const { role, email, password, firstName, lastName } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User is already registered' });
        }

        
        let newUser = new User({ email, password: hashedPassword, role, firstName, lastName });

        // Generate verification token
        const verificationToken = newUser.createVerificationToken();
        await newUser.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.PASSWORD // Your app password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: newUser.email,
            subject: 'Email Verification',
            text: `Please verify your email using this token: ${verificationToken}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: `${role} registered successfully. Please check your email for verification`, userId: newUser._id });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Something went wrong during registration' });
    }
}