import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendResponse from "../../helpers/sendResponse.js";
import User from "../../models/User.model.js";
dotenv.config();

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Please provide email and password',
                data: null
            });
        }


        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) return sendResponse(res, 400, null, true, "User does not exist with this email");
        
        // Check if the provided password matches the stored hashed password
        const isPasswordCorrect = await user.correctPassword(password);

        // // Check if password is correct
        if (!isPasswordCorrect) return sendResponse(res, 400, null, true, "Invalid password");

        // Generate JWT token
        const payload = {
            id: user._id,
            user_type: user.role
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        user.password = undefined; // Removing password from user object before sending response
        // console.log(user, token);

        sendResponse(res, 200, {user, token}, false, "User logged in successfully");
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, null, true, "Error logging in user: " + err.message);
    }
}

