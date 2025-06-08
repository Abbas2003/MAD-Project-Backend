import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";
import bcrypt from "bcryptjs";


export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;


        // Find the user by ID
        const user = await baseUser.findById(userId).select('+password');
        if (!user) {
            return sendResponse(res, 404, null, true, 'User not found');
        }


        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return sendResponse(res, 401, null, true, 'Old password is incorrect');
        }

        // Update the password
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return sendResponse(res, 200, null, false, 'Password updated successfully');
    } catch (error) {
        return sendResponse(res, 500, null, true, `Server error: ${error.message}`);
    }
};