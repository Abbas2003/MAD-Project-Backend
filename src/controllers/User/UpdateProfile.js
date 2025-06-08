import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user_type = req.user.user_type; // 'agent', 'agency', 'client', 'admin'

        // console.log('User type:', user_type, 'User ID:', userId);
        // console.log("Rating:", parseFloat(req.body.rating));
        
        if (req.body.rating && (req.body.rating < 0 || req.body.rating > 5)) {
            return sendResponse(res, 400, null, true, 'Rating must be between 0 and 5');
        }

        // Parse JSON fields only if they are strings
        const socialLinks = typeof req.body.socialLinks === 'string'
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks;


        const commonFields = {
            nickname: req.body.nickname,
            tagline: req.body.tagline,
            description: req.body.description,
            rating: req.body.rating ? parseFloat(req.body.rating) : 0,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };

        const extraFieldsByType = {};

        if (user_type == 'agent' || user_type == 'agency') {
            Object.assign(extraFieldsByType, {
                memberOfMNEF: req.body.memberOfMNEF,
                phoneNumber: req.body.phoneNumber,
                officeAddress: req.body.officeAddress,
                experienceYears: req.body.experienceYears ? parseInt(req.body.experienceYears, 10) : undefined,
                companyRegistrationNumber: req.body.companyRegistrationNumber,
                zipCode: req.body.zipCode,
                profileVisits: req.body.profileVisits ? parseInt(req.body.profileVisits, 10) : undefined,
            });
        }

        const updateFields = { ...commonFields, ...extraFieldsByType };

        // Handle merging of socialLinks
        if (socialLinks) {
            const user = await baseUser.findById(userId).select('socialLinks');
            if (user && user.socialLinks) {
                updateFields.socialLinks = { ...user.socialLinks.toObject(), ...socialLinks };
            } else {
                updateFields.socialLinks = socialLinks;
            }
        }

        // Handle profile image upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile_images',
                public_id: `user_${userId}`,
                overwrite: true
            });
            updateFields.profileImage = result.secure_url; // Save the Cloudinary URL
        }

        // Log the fields being updated for debugging
        // console.log('Update Fields:', updateFields);

        const updatedUser = await baseUser.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );


        // console.log('Updated User:', updatedUser?.rating);

        if (!updatedUser) {
            return sendResponse(res, 404, null, true, 'User profile not updated');
        }

        return sendResponse(res, 200, updatedUser, false, 'Profile updated successfully');
    } catch (error) {
        console.error('Update Profile Error:', error);
        return sendResponse(res, 500, null, true, 'Server Error');
    }
};

