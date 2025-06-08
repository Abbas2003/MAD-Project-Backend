import mongoose from "mongoose";
import baseUser from "./NewUser.model.js";


const Client = baseUser.discriminator('client', new mongoose.Schema({
    requests: [{ type: mongoose.Schema.ObjectId, ref: 'AgentRequest' }],
    reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
    favorites: [{ type: mongoose.Schema.ObjectId, ref: 'baseUser' }]
}));


export default Client;