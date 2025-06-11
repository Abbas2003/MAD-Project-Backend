import mongoose from "mongoose";
import User from "./User.model.js";


const Faculty = User.discriminator('faculty', new mongoose.Schema({
    department: String,
}));


export default Faculty;