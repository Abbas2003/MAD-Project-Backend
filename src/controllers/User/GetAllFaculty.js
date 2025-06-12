import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";

export const getAllFaculty = async (req, res) => {
    try {
        // Find all users with role 'faculty'
        const faculty = await User.find({ role: "faculty" });

        if( faculty.length === 0) {
            return sendResponse(res, 404, null, true, "No faculty found.");
        }
        
        return sendResponse(res, 200, faculty, false, "All faculty fetched successfully.");
    } catch (error) {
        console.error("Get All Faculty Error:", error);
        return sendResponse(res, 500, null, true, `Server Error: ${error.message}`);
    }
};