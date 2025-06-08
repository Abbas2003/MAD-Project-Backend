import express from 'express';
import verifyToken from '../middlewares/Authorization.js';
import upload from '../utils/multer.js';
import { updateProfile } from '../controllers/User/UpdateProfile.js';
import { manipulateServices } from '../controllers/User/ManipulateServices.js';
import { getUserById } from '../controllers/User/GetUserById.js';
import { getAgents } from '../controllers/User/GetAgents.js';
import { isFavorite } from '../controllers/User/Favorite.js';
import { updatePassword } from '../controllers/Auth/UpdatePassword.js';
import { getFavorites } from '../controllers/User/AllFavorite.js';
import { incrementProfileVisits } from '../controllers/User/ProfileCount.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing user-related operations
 */

/**
 * @swagger
 * /api/v1/user/update-profile:
 *   put:
 *     summary: Update the profile of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               nickname:
 *                 type: string
 *                 example: JohnDoe
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               tagline:
 *                 type: string
 *                 example: Real Estate Expert
 *               description:
 *                 type: string
 *                 example: Experienced agent specializing in luxury properties.
 *               socialLinks:
 *                 type: string
 *                 example: '{"facebook": "https://facebook.com/johndoe", "linkedin": "https://linkedin.com/in/johndoe", "twitter": "https://twitter.com/johndoe", "instagram": "https://instagram.com/johndoe", "youtube": "https://youtube.com/johndoe"}'
 *               memberOfMNEF:
 *                 type: boolean
 *                 example: true
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               rating:
 *                 type: integer
 *                 example: 4.5
 *               officeAddress:
 *                 type: string
 *                 example: "123 Main Street, City, Country"
 *               experienceYears:
 *                 type: integer
 *                 example: 5
 *               companyRegistrationNumber:
 *                 type: string
 *                 example: "123456789"
 *               zipCode:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User profile not updated
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.put('/update-profile', verifyToken, upload.single('profileImage'), updateProfile);

/**
 * @swagger
 * /api/v1/user/update-services:
 *   patch:
 *     summary: Update the services offered by the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                       example: Property Management
 *                     subServices:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Tenant Screening", "Rent Collection"]
 *     responses:
 *       200:
 *         description: Services updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found or is not an agent/agency
 *       500:
 *         description: Failed to update services
 */
router.patch('/update-services', verifyToken, manipulateServices);

/**
 * @swagger
 * /api/v1/user/get-user-profile/{id}:
 *   get:
 *     summary: Get the profile of a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/get-user-profile/:id', verifyToken, getUserById);

/**
 * @swagger
 * /api/v1/user/agents:
 *   get:
 *     summary: Get a list of all agents
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agents fetched successfully
 *       404:
 *         description: No agents found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/agents', getAgents);

/**
 * @swagger
 * /api/v1/user/favorite:
 *   post:
 *     summary: Add or remove a user from the client's favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               favoriteId:
 *                 type: string
 *                 example: 60d21b4967d0d8992e610c90
 *     responses:
 *       200:
 *         description: Successfully added or removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Added to favorites
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Client not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Toggle Favorite error: <error message>"
 */
router.post('/favorite', verifyToken, isFavorite);

/**
 * @swagger
 * /api/v1/user/get-favorites:
 *   post:
 *     summary: Get all favorite agents/agencies for a client
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: List of favorite agents/agencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                   example: Favorite agents/agencies fetched successfully
 *       400:
 *         description: Invalid clientId
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get('/get-favorites/:clientId', getFavorites);

/**
 * @swagger
 * /api/v1/user/count-profile-clicks:
 *   post:
 *     summary: Increment the profile visit count for an agent
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agentId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Profile visit count incremented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     profileVisits:
 *                       type: integer
 *                       example: 11
 *                 message:
 *                   type: string
 *                   example: Profile visit count incremented
 *       400:
 *         description: Invalid agentId
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Server error
 */
router.post('/count-profile-clicks', incrementProfileVisits);

/**
 * @swagger
 * /api/v1/user/update-password:
 *   put:
 *     summary: Update the password of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid request or old password is incorrect
 *       401:
 *         description: Unauthorized access
 */
router.put('/update-password', verifyToken, updatePassword);


export default router;