import Faq from "../../models/Faq.model.js";
import sendResponse from "../../helpers/sendResponse.js";

export const createFaq = async (req, res) => {
    try {
        const { question, answer, type } = req.body;

        if (!question || !answer) {
            return sendResponse(res, 400, null, true, "Question and answer are required");
        }

        const newFaq = new Faq({ question, answer, type });
        await newFaq.save();

        sendResponse(res, 201, newFaq, false, "FAQ created successfully");
    } catch (error) {
        console.error("Error creating FAQ:", error?.message);
        sendResponse(res, 500, null, true, `Error creating FAQ: ${error?.message}`);
    }
}

export const getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find();
        if (!faqs || faqs.length === 0) {
            return sendResponse(res, 404, null, true, "No FAQs found");
        }
        sendResponse(res, 200, faqs, false, "FAQs fetched successfully");
    } catch (error) {
        console.error("Error fetching FAQs:", error?.message);
        sendResponse(res, 500, null, true, `Error fetching FAQs: ${error?.message}`);
    }
}

export const updateFaq = async (req, res) => {
    try {
        const { question, answer, type } = req.body;
        const { id } = req.params;

        if (!question || !answer) {
            return sendResponse(res, 400, null, true, "Question and answer are required");
        }

        const updatedFaq = await Faq.findByIdAndUpdate(id, { question, answer, type }, { new: true });

        if (!updatedFaq) {
            return sendResponse(res, 404, null, true, "FAQ not found");
        }

        sendResponse(res, 200, updatedFaq, false, "FAQ updated successfully");
    } catch (error) {
        console.error("Error updating FAQ:", error?.message);
        sendResponse(res, 500, null, true, `Error updating FAQ: ${error?.message}`);
    }
}

export const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFaq = await Faq.findByIdAndDelete(id);

        if (!deletedFaq) {
            return sendResponse(res, 404, null, true, "FAQ not found");
        }

        sendResponse(res, 200, deletedFaq, false, "FAQ deleted successfully");
    } catch (error) {
        console.error("Error deleting FAQ:", error?.message);
        sendResponse(res, 500, null, true, `Error deleting FAQ: ${error?.message}`);
    }
}
