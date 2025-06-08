import "dotenv/config";
import jwt from "jsonwebtoken";
import sendResponse from "../helpers/sendResponse.js";
import baseUser from "../models/NewUser.model.js";

const verifyToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        
        const bearerToken = bearerHeader && bearerHeader.split(" ")[1];
        if (!bearerToken) {
            return sendResponse(res, 401, null, true, "Unauthorized access. No token provided.");
        }

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        
        if (decoded) {
            const user = await baseUser.findById(decoded.id).lean();
            if (!user) return sendResponse(res, 401, null, true, "User not found.");
            
            req.user = decoded;
            next();
        } else {
            return sendResponse(res, 401, null, true, "Decoded not available.");
        }
        
    } catch (error) {
        console.error("Error verifying token:", error.message);
        sendResponse(res, 401, null, true, "Error verifying token. " + error.message);
    }
};

export default verifyToken;