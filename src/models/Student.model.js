import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';


// Base user schema with shared fields for all user types
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'faculty', 'student', 'super admin'],
        default: 'student'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
    discriminatorKey: 'role',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Method to check password
userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Password reset token generation
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = resetToken;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

// Verification token generation
userSchema.methods.createVerificationToken = function () {
    const verificationToken = crypto.randomBytes(4).toString('hex');
    this.verificationToken = verificationToken;
    this.verificationTokenExpires = Date.now() + 60 * 60 * 1000; 
    return verificationToken;
};

// Base model
const Student = mongoose.model('student', userSchema);

// Discriminators
export default Student;