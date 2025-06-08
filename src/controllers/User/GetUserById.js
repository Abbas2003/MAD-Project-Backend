import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";


export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await baseUser.findById(userId).select('-password');
        console.log('User ID:', userId);
        console.log(user);
        
        if (!user) {
            return sendResponse(res, 404, null, true, 'User not found');
        }

        return sendResponse(res, 200, user, false, 'User fetched successfully');
    } catch (error) {
        console.error('Error fetching user:', error);
        return sendResponse(res, 500, null, true, `Error fetching user: ${error.message}`);
    }
}