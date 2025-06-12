import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";

export const getAllStudents = async (req, res) => {
    try {
        // Find all users with role 'student'
        const students = await User.find({ role: "student" });

        return sendResponse(res, 200, students, false, "All students fetched successfully.");
    } catch (error) {
        console.error("Get All Students Error:", error);
        return sendResponse(res, 500, null, true, "Server Error");
    }
};