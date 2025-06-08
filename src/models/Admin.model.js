import mongoose from "mongoose";
import baseUser from "./NewUser.model.js";


const Admin = baseUser.discriminator('admin', new mongoose.Schema({
    permissions: [{ type: String, enum: ['users', 'leads', 'blogs', 'faqs', 'all'] }],
    isSuperAdmin: { type: Boolean, default: false }
}));


export default Admin;