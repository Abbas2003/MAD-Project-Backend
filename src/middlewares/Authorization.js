import "dotenv/config";
import jwt from "jsonwebtoken";
import sendResponse from "../helpers/sendResponse.js";
import Student from "../models/User.model.js";

const verifyToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        
        const bearerToken = bearerHeader && bearerHeader.split(" ")[1];
        if (!bearerToken) {
            return sendResponse(res, 401, null, true, "Unauthorized access. No token provided.");
        }

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        
        if (decoded) {
            const user = await Student.findById(decoded.id).lean();
            if (!user) return sendResponse(res, 401, null, true, "User not found.");

            if(user.isVerified == false) return sendResponse(res, 401, null, true, "User not verified.");
            
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