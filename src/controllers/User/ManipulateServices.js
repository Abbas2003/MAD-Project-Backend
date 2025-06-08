import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";


export const manipulateServices = async (req, res) => {
    const userId = req.user.id;
    const user_type = req.user.user_type;
    const services = req.body.services; // Assuming services is passed in the request body

    // console.log('User type:', user_type, 'User ID:', userId);

    try {
        // Validate if the user exists and is an agent or agency
        const existingUser = await baseUser.findById(userId);
        if (!existingUser || (existingUser.role !== 'agent' && existingUser.role !== 'agency')) {
            return sendResponse(res, 404, null, true, "User not found or is not an agent/agency.")
        }

        if (!services || !Array.isArray(services)) {            
            return sendResponse(res, 404, null, true, 'Invalid request: "services" must be a non-empty array.')
        }

        const updatedServices = existingUser?.services || [];

        for (const newService of services) {
            if (!newService.service || typeof newService.service !== 'string' || !newService.service.trim()) {
                // return res.status(400).json({ message: 'Each service object must have a non-empty string "service" property.' });
                return sendResponse(res, 400, null, true, 'Invalid request: Each service object must have a non-empty string "service" property.')
            }
            if (newService.subServices && !Array.isArray(newService.subServices)) {
                return sendResponse(res, 400, null, true, 'Invalid request: The "subServices" property must be an array of strings.')
            }
            if (newService.subServices) {
                for (const subService of newService.subServices) {
                    if (typeof subService !== 'string') {
                        // return res.status(400).json({ message: 'Each element in "subServices" must be a string.' });
                        return sendResponse(res, 400, null, true, 'Invalid request: Each element in "subServices" must be a string.')
                    }
                }
            }

            const existingServiceIndex = updatedServices.findIndex(
                existing => existing.service === newService.service
            );

            if (existingServiceIndex > -1) {
                // Service exists, update it
                updatedServices[existingServiceIndex] = {
                    ...updatedServices[existingServiceIndex],
                    ...newService,
                    subServices: Array.isArray(newService.subServices)
                        ? newService.subServices
                        : (updatedServices[existingServiceIndex].subServices || []) // Keep existing if new is not an array
                };
            } else {
                // Service doesn't exist, add it
                updatedServices.push(newService);
            }
        }

        existingUser.services = updatedServices;
        const savedUser = await existingUser.save();

        return res.status(200).json({ message: 'Services updated successfully.', services: savedUser.services });

    } catch (error) {
        console.error('Error manipulating services:', error.message);
        return res.status(500).json({ message: 'Failed to update services.', error: error.message });
    }
}