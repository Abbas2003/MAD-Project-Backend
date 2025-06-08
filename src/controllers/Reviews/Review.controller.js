import baseUser from '../../models/NewUser.model.js';
import Review from '../../models/Review.model.js';
import sendResponse from '../../helpers/sendResponse.js';
import Agent from '../../models/Agent.model.js';
import mongoose from 'mongoose';

export const giveReview = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { targetId, comments, rating } = req.body;


        // Validate input
        if (!targetId || !comments || !rating) {
            return sendResponse(res, 400, null, true, 'Target ID, comments, and rating are required');
        }

        if (rating < 0 || rating > 5) {
            return sendResponse(res, 400, null, true, 'Rating must be between 0 and 5');
        }

        // Check if the target user exists and is an agent or agency
        const targetUser = await baseUser.findById(targetId);
        if (!targetUser || (targetUser.role !== 'agent' && targetUser.role !== 'agency')) {
            return sendResponse(res, 404, null, true, 'Target user not found or is not an agent/agency');
        }

        // Check if the client has already reviewed this target
        const existingReview = await Review.findOne({ client_id: clientId, agent_id: targetId });
        let newReview;
        if (existingReview) {
            // Update the existing review
            existingReview.comments = comments;
            existingReview.rating = rating;
            await existingReview.save();
        } else {
            // Create a new review
            newReview = new Review({
                client_id: clientId,
                agent_id: targetId,
                comments,
                rating
            });
            await newReview.save();

            // Add the review to the target user's profile
            targetUser.reviews.push(newReview._id);
        }

        // Update the target user's average rating
        const reviews = await Review.find({ agent_id: targetId });
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        targetUser.rating = averageRating;
        await targetUser.save();

        return sendResponse(res, 201, null, false, 'Review submitted successfully');
    } catch (error) {
        console.error('Error submitting review:', error.message);
        return sendResponse(res, 500, null, true, 'Error submitting review: ' + error.message);
    }
};

export const getReviewById = async (req, res) => {
    try {
        const agentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(agentId)) {
            return sendResponse(res, 400, null, true, 'Invalid agentId');
        }

        const agent = await Agent.findById(agentId);

        if (!agent) {
            return sendResponse(res, 404, null, true, 'Agent not found');
        }

        const reviewId = agent.reviews;
        if (!reviewId || reviewId.length === 0) {
            return sendResponse(res, 404, null, true, 'No reviews found for this agent');
        }

        let reviews = [];
        for (const id of reviewId) {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                reviews.push({ reviewId: id, error: "Invalid reviewId" });
                continue;
            }

            const review = await Review.findById(id)
                .populate('client_id', 'firstName lastName nickname profileImage email profileImage')
                .populate('agent_id', 'firstName lastName nickname profileImage email profileImage');

            if (!review) {
                reviews.push({ reviewId: id, error: "Review not found" });
                continue;
            }

            reviews.push(review);
        }

        console.log("All Reviews", reviews);
        return sendResponse(res, 200, reviews, false, 'Reviews fetched successfully');
    } catch (error) {
        console.error('Error fetching review:', error.message);
        return sendResponse(res, 500, null, true, 'Error fetching review: ' + error.message);
    }
};
