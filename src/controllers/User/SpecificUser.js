import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";


export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return sendResponse(res, 404, null, true, 'User not found');
        }

        return sendResponse(res, 200, user, false, 'User fetched successfully');
    } catch (error) {
        console.error('Get User By ID Error:', error);
        return sendResponse(res, 500, null, true, 'Server Error');
    }
}

