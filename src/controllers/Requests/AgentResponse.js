import AgentRequest from "../../models/AgentRequest.model.js";
import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { clientRequestResponseEmailTemplate } from "../../utils/clientRequestResponseEmailTemplate.js";
dotenv.config();


export const agentResponse = async (req, res) => {
    try {
        const { status, isOpen } = req.body;
        const { requestId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return sendResponse(res, 400, null, true, 'Invalid requestId');
        }

        // Validate the request body
        if (!status) {
            return sendResponse(res, 400, null, true, 'Status is required');
        }
        if (status !== 'accepted' && status !== 'denied') {
            return sendResponse(res, 400, null, true, 'Status must be either accepted or denied');
        }

        // Check if the requestId exists
        const request = await AgentRequest.findById(requestId);
        if (!request) {
            return sendResponse(res, 404, null, true, 'Request not found');
        }

        // Update the request status
        request.status = status;
        request.isOpen = isOpen;
        await request.save();

        // Get client from the request
        const client = await baseUser.findById(request.client);
        if (!client) {
            return sendResponse(res, 404, null, true, 'Client not found');
        }

        // Get agent from the request for the email template
        const agent = await baseUser.findById(request.agent);
        if (!agent) {
            return sendResponse(res, 404, null, true, 'Agent not found');
        }

        // Send email to the client about the response
        try {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            await transporter.sendMail({
                from: 'RealMatch',
                to: client.email,
                subject: `Your request has been ${status}`,
                html : clientRequestResponseEmailTemplate(`${ agent.nickname ? agent.nickname : `${agent.firstName} ${agent.lastName}` }`,  request.title, agent.email, agent.profileImage, agent.phoneNumber, agent.description, status)
            });
        } catch (emailError) {
            console.log('Error sending email:', emailError);
            return sendResponse(res, 500, null, true, 'Failed to send email notification');
        }

        return sendResponse(res, 200, request, false, 'Request updated successfully');
    } catch (error) {
        console.error('Error in agentResponse:', error);
        return sendResponse(res, 500, null, true, `Internal server error: ${error.message}`);
    }
};