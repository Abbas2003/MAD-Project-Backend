import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forget Password Email:", email);

    // Check if user exists
    const user = await baseUser.findOne({ email });
    if (!user) return sendResponse(res, 400, null, true, "User does not exist with this email");

    // Generate password reset token
    const passwordResetToken = user.createPasswordResetToken();
    console.log("Generated Password Reset Token:", passwordResetToken);
    
    await user.save();

    // Send password reset email
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
      subject: 'Reset Password',
      text: `Please reset your password using this token: ${passwordResetToken}`
    };

    await transporter.sendMail(mailOptions);

    sendResponse(res, 200, { message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forget Password Error:', error.message);
    sendResponse(res, 500, null, true, 'Something went wrong while sending password reset email: ' + error.message);
  }
};