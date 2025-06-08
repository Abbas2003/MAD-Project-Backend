import AgentRequest from "../../models/AgentRequest.model.js";
import sendResponse from "../../helpers/sendResponse.js";
import baseUser from "../../models/NewUser.model.js";
import Agency from "../../models/Agency.model.js";
import Agent from "../../models/Agent.model.js";
import nodemailer from 'nodemailer'
import mongoose from "mongoose";
import { receveClientRequestEmailTemaple } from "../../utils/receveRequestFromClientEmail.js";


export const clientRequest = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { title, message, status, isOpen } = req.body;
        const { agentId } = req.params;

        // Validate the request body
        if (!title || !message || !status || isOpen === undefined) {
            return sendResponse(res, 400, null, true, 'Title, message, status, and isOpen are required');
        }
        if (status !== 'pending' && status !== 'accepted' && status !== 'denied') {
            return sendResponse(res, 400, null, true, 'Status must be either pending, accepted, or denied');
        }

        // Check if the agentId exists
        const agent = await baseUser.findById(agentId);
        if (!agent) {
            return sendResponse(res, 404, null, true, 'Agent not found');
        }

        // Check if the client exists
        const client = await baseUser.findById(clientId);
        if (!client) {
            return sendResponse(res, 404, null, true, 'Client not found');
        }

        const request = {
            client: clientId,
            agent: agentId,
            title,
            message,
            status, 
            isOpen
        };

        // Create a new request
        const newRequest = await AgentRequest.create(request);
        if (!newRequest) {
            return sendResponse(res, 500, null, true, 'Failed to create request');
        }

        // Update the agent/agency with the new request
        if (agent?.role === 'agency') {
            const updatedAgency = await Agency.findByIdAndUpdate(agentId, { $push: { clientRequests: newRequest._id } }, { new: true });
            console.log('Updated Agency:', updatedAgency);
        } else if(agent?.role === 'agent') {
            const updatedAgent = await Agent.findByIdAndUpdate(agentId, { $push: { clientRequests: newRequest._id } }, { new: true });
            console.log('Updated Agent:', updatedAgent);
        }


        // Send email to the agent about the request nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const email = {
            from: "RealMatch",
            to: agent.email,
            subject: `New Request from Client ${ client.nickname ? client.nickname : `${client.firstName} ${client.lastName}` }`,
            html: receveClientRequestEmailTemaple(`${ client.nickname ? client.nickname : `${client.firstName} ${client.lastName}` }`,  title, client.email, client.profileImage, client.phoneNumber, client.description)
        };

        await transporter.sendMail(email);
        return sendResponse(res, 200, null, false, 'Request sent successfully');

    } catch (error) {
        console.error('Client Request Error:', error);
        return sendResponse(res, 500, null, true, `Client Request error: ${error.message}`);
    }
}

export const getClientRequests = async (req, res) => {
    try {
        const clientId = req.user.id;

        // Check if the client exists
        const client = await baseUser.findById(clientId);
        if (!client) {
            return sendResponse(res, 404, null, true, 'Client not found');
        }

        // Get all requests for the client
        const requests = await AgentRequest.find({ agent: clientId })
        .populate('client', 'firstName lastName nickname email role profileImage');

        return sendResponse(res, 200, requests, false, 'Client requests retrieved successfully');
    } catch (error) {
        console.error('Get Client Requests Error:', error);
        return sendResponse(res, 500, null, true, `Get Client Requests error: ${error.message}`);
    }
}

export const getSingleClientRequest = async (req, res) => {
    try {
        const clientId = req.user.id;
        // const { requestId } = req.params;

        if (!clientId) {
            return sendResponse(res, 400, null, true, 'Invalid requestId');
        }

        const request = await AgentRequest.find({ client: clientId })
            .populate('agent', 'firstName lastName nickname email role profileImage');

        if (!request) {
            return sendResponse(res, 404, null, true, 'Request not found');
        }

        return sendResponse(res, 200, request, false, 'Client request fetched successfully');
    } catch (error) {
        console.error('Error fetching client request:', error);
        return sendResponse(res, 500, null, true, 'Server error');
    }
};