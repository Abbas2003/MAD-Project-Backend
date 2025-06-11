import mongoose from "mongoose";
import User from "./User.model.js";


const Student = User.discriminator('student', new mongoose.Schema({
    courses: [String],
    studentId: String,
    semester: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
    },
    cgpa: String
}));


export default Student;