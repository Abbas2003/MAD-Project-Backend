import Agent from "../../models/Agent.model.js";
import Agency from "../../models/Agency.model.js";
import baseUser from "../../models/NewUser.model.js";
import sendResponse from "../../helpers/sendResponse.js";
import mongoose from "mongoose";

export const incrementProfileVisits = async (req, res) => {
  try {
    const { agentId } = req.body;

    // Validate agentId
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return sendResponse(res, 400, null, true, "Invalid agentId");
    }

    // Find user and check role
    const user = await baseUser.findById(agentId);
    if (!user) {
      return sendResponse(res, 404, null, true, "User not found");
    }

    let updatedProfile = null;

    if (user.role === "agent") {
      updatedProfile = await Agent.findByIdAndUpdate(
        agentId,
        { $inc: { profileVisits: 1 } },
        { new: true }
      );
    } else if (user.role === "agency") {
      updatedProfile = await Agency.findByIdAndUpdate(
        agentId,
        { $inc: { profileVisits: 1 } },
        { new: true }
      );
    } else {
      return sendResponse(res, 400, null, true, "Profile visit count can only be incremented for agents or agencies");
    }

    return sendResponse(
      res,
      200,
      { profileVisits: updatedProfile.profileVisits },
      false,
      "Profile visit count incremented"
    );
  } catch (error) {
    console.error("Error incrementing profile visits:", error.message);
    return sendResponse(res, 500, null, true, `Server error: ${error.message}`);
  }
};