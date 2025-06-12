import sendResponse from "../../helpers/sendResponse.js";
import cloudinary from "../../utils/cloudinary.js";
import User from "../../models/User.model.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Only allow firstName, lastName, and profileImage
        const updateFields = {};

        if (req.body.firstName) {
            if (typeof req.body.firstName !== "string" || !req.body.firstName.trim()) {
                return sendResponse(res, 400, null, true, "First name is required and must be a string.");
            }
            updateFields.firstName = req.body.firstName.trim();
        }
        if (req.body.lastName) {
            if (typeof req.body.lastName !== "string" || !req.body.lastName.trim()) {
                return sendResponse(res, 400, null, true, "Last name is required and must be a string.");
            }
            updateFields.lastName = req.body.lastName.trim();
        }
        if (req.body.department) {
            if (typeof req.body.department !== "string" || !req.body.department.trim()) {
                return sendResponse(res, 400, null, true, "Department is required and must be a string.");
            }
            updateFields.department = req.body.department.trim();
        }

        // Handle profile image upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile_images',
                public_id: `user_${userId}`,
                overwrite: true
            });
            updateFields.profileImage = result.secure_url;
        }

        // Prevent updating any other fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return sendResponse(res, 404, null, true, 'User profile not updated');
        }

        return sendResponse(res, 200, updatedUser, false, 'Profile updated successfully');
    } catch (error) {
        console.error('Update Profile Error:', error);
        return sendResponse(res, 500, null, true, 'Server Error');
    }
};