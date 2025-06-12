import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";

export const addStudentDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        // Only students can add student details
        if (req.user.user_type !== "student") {
            return sendResponse(res, 403, null, true, "Only students can add student details.");
        }

        const { studentId, department, cgpa, semester } = req.body;

        // Validation
        if (!studentId || typeof studentId !== "string" || !studentId.trim()) {
            return sendResponse(res, 400, null, true, "studentId is required and must be a non-empty string.");
        }
        if (!department || typeof department !== "string" || !department.trim()) {
            return sendResponse(res, 400, null, true, "department is required and must be a non-empty string.");
        }
        if (!cgpa || typeof cgpa !== "string" || !cgpa.trim()) {
            return sendResponse(res, 400, null, true, "cgpa is required and must be a non-empty string.");
        }
        const allowedSemesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
        if (!semester || !allowedSemesters.includes(semester)) {
            return sendResponse(res, 400, null, true, "semester is required and must be one of: " + allowedSemesters.join(", "));
        }

        // Update student details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    studentId: studentId.trim(),
                    department: department.trim(),
                    cgpa: cgpa.trim(),
                    semester
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return sendResponse(res, 404, null, true, "User not found.");
        }

        return sendResponse(res, 200, updatedUser, false, "Student details added/updated successfully.");
    } catch (error) {
        console.error("Add Student Details Error:", error);
        return sendResponse(res, 500, null, true, "Server Error");
    }
};