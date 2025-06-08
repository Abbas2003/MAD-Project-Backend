import sendResponse from "../../helpers/sendResponse.js";
import Client from "../../models/Client.model.js";
import baseUser from "../../models/NewUser.model.js";
import mongoose from "mongoose";

export const isFavorite = async (req, res) => {
  try {
    const clientId = req.body.clientId; // logged-in user
    const favoriteId = req.body.favoriteId; // user to check as favorite

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return sendResponse(res, 400, null, false, 'Invalid clientId');
    }
    if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
      return sendResponse(res, 400, null, false, 'Invalid favoriteId');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return sendResponse(res, 404, null, false, 'Client not found');
    }

    const fav = await baseUser.findById(favoriteId);
    if (!fav) {
      return sendResponse(res, 404, null, false, 'Favorite user not found');
    }

    const isAlreadyFavorite = client.favorites.includes(favoriteId);

    if (isAlreadyFavorite) {
      client.favorites.pull(favoriteId); // Remove
      await client.save();
      return sendResponse(res, 200, null, false, 'Removed from favorites');
    } else {
      client.favorites.addToSet(favoriteId); // Add (no duplicates)
      await client.save();
      return sendResponse(res, 200, null, false, 'Added to favorites');
    }

  } catch (error) {
    console.error('Toggle Favorite Error:', error);
    return sendResponse(res, 500, null, true, `Toggle Favorite error: ${error.message}`);
  }
};
