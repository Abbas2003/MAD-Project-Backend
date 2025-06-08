import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import baseUser from '../../models/NewUser.model.js';
import Client from '../../models/Client.model.js';
import Agent from '../../models/Agent.model.js';
import Agency from '../../models/Agency.model.js';
import Admin from '../../models/Admin.model.js';

export const registerUser = async (req, res) => {
    try {
        const { user_type, email, password, ...userData } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);


        const existingUser = await baseUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User is already registered' });
        }

        let newUser;

        switch (user_type) {
            case 'client':
                newUser = new Client({ email, password: hashedPassword, ...userData });
                break;

            case 'agent':
                newUser = new Agent({ email, password: hashedPassword, ...userData });
                break;

            case 'agency':
                newUser = new Agency({ email, password: hashedPassword, ...userData });
                break;

            case 'admin':
                newUser = new Admin({ email, password: hashedPassword, ...userData });
                break;

            default:
                return res.status(400).json({ error: 'Invalid user_type provided' });
        }

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

        res.status(201).json({ message: `${user_type} registered successfully. Please check your email for verification`, userId: newUser._id });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Something went wrong during registration' });
    }
}