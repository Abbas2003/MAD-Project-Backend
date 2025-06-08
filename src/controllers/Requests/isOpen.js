import mongoose from "mongoose";
import sendResponse from "../../helpers/sendResponse.js";
import AgentRequest from "../../models/AgentRequest.model.js";

const isOpen = async (req, res) => {
    try {
        const { requestIds } = req.body;

        if (!Array.isArray(requestIds) || requestIds.length === 0) {
            return sendResponse(res, 400, null, true, 'requestIds must be a non-empty array');
        }
        
        // Validate all ObjectIds
        for (const id of requestIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return sendResponse(res, 400, null, true, `Invalid requestId: ${id}`);
            }
        }

        // Toggle isOpen for each request
        const results = [];
        for (const id of requestIds) {
            const request = await AgentRequest.findById(id);
            if (request) {
                request.isOpen = !request.isOpen;
                await request.save();
                results.push({ requestId: id, isOpen: request.isOpen });
            } else {
                results.push({ requestId: id, error: "Request not found" });
            }
        }

        return sendResponse(res, 200, results, false, 'IsOpen toggled for provided requests');
    } catch (error) {
        console.error('Error fetching IsOpen:', error.message);
        return sendResponse(res, 500, null, true, `Server error: ${error.message}`);
    }
};

export default isOpen;