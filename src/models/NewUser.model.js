import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';

// Base social links schema
const socialLinksSchema = new mongoose.Schema({
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    youtube: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
});

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
        enum: ['client', 'agent', 'agency', 'admin'],
        default: 'client'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    nickname: { type: String, trim: true, unique: true },
    tagline: { type: String, trim: true },
    description: { type: String },
    socialLinks: socialLinksSchema,
    memberOfMNEF: { type: Boolean, default: false },
    phoneNumber: { type: String, trim: true },
    officeAddress: { type: String, trim: true },
    experienceYears: { type: Number },
    companyRegistrationNumber: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    profileVisits: { type: Number, default: 0 }
}, {
    timestamps: true,
    discriminatorKey: 'role',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save hook to hash password
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     try {
//         // const salt = await bcrypt.genSalt(12);
//         this.password = await bcrypt.hash(this.password, 12);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

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
const baseUser = mongoose.model('baseUser', userSchema);

// Discriminators
export default baseUser;