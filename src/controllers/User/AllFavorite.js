import Client from "../../models/Client.model.js";
import sendResponse from "../../helpers/sendResponse.js";
import mongoose from "mongoose";

export const getFavorites = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return sendResponse(res, 400, null, true, "Invalid clientId");
    }

    // Find client and populate favorites
    const client = await Client.findById(clientId).populate({
      path: "favorites",
      match: { role: { $in: ["agent", "agency"] } }, // Only agents/agencies
      select: "-password -leads -__v -isVerified -createdAt -updatedAt" // Exclude password field
    });

    if (!client) {
      return sendResponse(res, 404, null, true, "Client not found");
    }

    return sendResponse(res, 200, client.favorites, false, "Favorite agents/agencies fetched successfully");
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return sendResponse(res, 500, null, true, "Server error");
  }
};