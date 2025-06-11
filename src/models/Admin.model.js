import mongoose from "mongoose";
import User from "./User.model.js";


const Admin = User.discriminator('admin', new mongoose.Schema({
    
}));


export default Admin;