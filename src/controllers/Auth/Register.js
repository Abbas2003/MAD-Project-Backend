import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import Admin from '../../models/Admin.model.js';
import Student from '../../models/User.model.js';
import User from '../../models/User.model.js';
import Faculty from '../../models/Faculty.model.js';
import SuperAdmin from '../../models/SuperAdmin.model.js';

export const registerUser = async (req, res) => {
    try {
        const { user_type, email, password, ...userData } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User is already registered' });
        }

        let newUser;

        switch (user_type) {
            case 'user':
                newUser = new User({ email, password: hashedPassword, ...userData });
                break;

            case 'student':
                newUser = new Student({ email, password: hashedPassword, ...userData });
                break;

            case 'faculty':
                newUser = new Faculty({ email, password: hashedPassword, ...userData });
                break;

            case 'admin':
                newUser = new Admin({ email, password: hashedPassword, ...userData });
                break;

            case 'super admin':
                newUser = new SuperAdmin({ email, password: hashedPassword, ...userData });
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