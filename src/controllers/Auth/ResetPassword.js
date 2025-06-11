import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";
import bcrypt from "bcryptjs";


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // console.log("Reset Password Token:", token);
    // console.log("New Password:", newPassword);
    

    // Find user by password reset token
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) return sendResponse(res, 400, null, true, "Invalid password reset token");

    // Check if token has expired
    if (user.passwordResetExpires < Date.now()) {
      return sendResponse(res, 400, null, true, "Password reset token has expired");
    }

    // Update user password
    user.password = await bcrypt.hash(newPassword, 12);
    console.log("Hashed New Password:", user.password);
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return sendResponse(res, 200, user, false, "Password reset successfully");
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    return sendResponse(res, 500, null, true, 'Something went wrong while resetting password: ' + error.message);
  }
};