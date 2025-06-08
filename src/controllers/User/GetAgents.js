import sendResponse from '../../helpers/sendResponse.js';
import baseUser from '../../models/NewUser.model.js';

export const getAgents = async (req, res) => {
    try {
        const agents = await baseUser.find({ role: 'agent' }).select('-password');

        if (!agents || agents.length === 0) {
            return sendResponse(res, 404, null, true, 'No agents found');
        }

        sendResponse(res, 200, agents, false, 'Agents fetched successfully');
    } catch (error) {
        console.error('Error fetching agents:', error?.message);
        sendResponse(res, 500, null, true, `Error fetching agents: ${error?.message}`);
    }
};