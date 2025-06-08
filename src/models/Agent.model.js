import mongoose from "mongoose";
import baseUser from "./NewUser.model.js";


const Agent = baseUser.discriminator('agent', new mongoose.Schema({
    services: [{
        service: { type: String, required: true },
        subServices: [{ type: String }]
    }],
    category: { type: String, trim: true },
    country: { type: String, trim: true },
    type: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    price: { type: Number },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
    clientRequests: [{ type: mongoose.Schema.ObjectId, ref: 'AgentRequest' }],
    leads: [{ type: mongoose.Schema.ObjectId, ref: 'Lead' }],
}));


export default Agent;