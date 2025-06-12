import express from 'express';
import verifyToken from '../middlewares/Authorization.js';
import upload from '../utils/multer.js';
import { updateProfile } from '../controllers/User/UpdateProfile.js';
import { getUserById } from '../controllers/User/SpecificUser.js';
import { updatePassword } from '../controllers/Auth/UpdatePassword.js';



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
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               # Student-specific fields
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Math", "Science"]
 *               studentId:
 *                 type: string
 *                 example: "STU123"
 *               semester:
 *                 type: string
 *                 enum: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th]
 *                 example: "3rd"
 *               cgpa:
 *                 type: string
 *                 example: "3.8"
 *               # Faculty-specific fields
 *               department:
 *                 type: string
 *                 example: "Computer Science"
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