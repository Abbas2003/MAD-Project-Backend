import mongoose from "mongoose";
import User from "./User.model.js";


const SuperAdmin = User.discriminator('super admin', new mongoose.Schema({
   
}));


export default SuperAdmin;