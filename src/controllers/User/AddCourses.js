import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";

export const addCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        // Only students can add courses
        if (req.user.user_type !== "student") {
            return sendResponse(res, 403, null, true, "Only students can add courses.");
        }

        const { courses } = req.body;

        // Validate courses
        if (!courses || !Array.isArray(courses) || courses.length === 0) {
            return sendResponse(res, 400, null, true, "Courses must be a non-empty array.");
        }
        for (const course of courses) {
            if (typeof course !== "string" || !course.trim()) {
                return sendResponse(res, 400, null, true, "Each course must be a non-empty string.");
            }
        }

        // Update user's courses (add new courses, avoid duplicates)
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, null, true, "User not found.");
        }

        const existingCourses = user.courses || [];
        const newCourses = courses.filter(
            (course) => !existingCourses.includes(course.trim())
        );
        user.courses = [...existingCourses, ...newCourses.map(c => c.trim())];

        await user.save();

        return sendResponse(res, 200, user, false, "Courses added successfully.");
    } catch (error) {
        console.error("Add Courses Error:", error);
        return sendResponse(res, 500, null, true, "Server Error");
    }
};