import sendResponse from "../../helpers/sendResponse.js";
import cloudinary from "../../utils/cloudinary.js";
import User from "../../models/User.model.js";

export const updateProfile = async (req, res) => {
    // try {
    //     const userId = req.user.id;
    //     const role = req.user.role;

    //     // Common fields for all users
    //     const commonFields = {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         profileImage: req.body.profileImage,
    //     };

    //     // Handle profile image upload
    //     if (req.file) {
    //         const result = await cloudinary.uploader.upload(req.file.path, {
    //             folder: 'profile_images',
    //             public_id: `user_${userId}`,
    //             overwrite: true
    //         });
    //         commonFields.profileImage = result.secure_url;
    //     }

    //     let updatedUser;

    //     if (role === "student") {
    //         // Student-specific fields
    //         const studentFields = {
    //             courses: req.body.courses, // array of strings
    //             studentId: req.body.studentId,
    //             semester: req.body.semester,
    //             cgpa: req.body.cgpa
    //         };
    //         updatedUser = await Student.findByIdAndUpdate(
    //             userId,
    //             { $set: { ...commonFields, ...studentFields } },
    //             { new: true, runValidators: true }
    //         );
    //     } else if (role === "faculty") {
    //         // Faculty-specific fields
    //         const facultyFields = {
    //             department: req.body.department
    //         };
    //         updatedUser = await Faculty.findByIdAndUpdate(
    //             userId,
    //             { $set: { ...commonFields, ...facultyFields } },
    //             { new: true, runValidators: true }
    //         );
    //     } else {
    //         // For admin, super admin, user (base User model)
    //         updatedUser = await User.findByIdAndUpdate(
    //             userId,
    //             { $set: commonFields },
    //             { new: true, runValidators: true }
    //         );
    //     }

    //     if (!updatedUser) {
    //         return sendResponse(res, 404, null, true, 'User profile not updated');
    //     }

    //     return sendResponse(res, 200, updatedUser, false, 'Profile updated successfully');
    // } catch (error) {
    //     console.error('Update Profile Error:', error);
    //     return sendResponse(res, 500, null, true, 'Server Error');
    // }
};

