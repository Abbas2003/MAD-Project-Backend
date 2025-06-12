import express from 'express';
import verifyToken from '../middlewares/Authorization.js';
import upload from '../utils/multer.js';
import { updateProfile } from '../controllers/User/UpdateProfile.js';
import { getUserById } from '../controllers/User/SpecificUser.js';
import { updatePassword } from '../controllers/Auth/UpdatePassword.js';
import { addCourses } from '../controllers/User/AddCourses.js';
import { addStudentDetails } from '../controllers/User/StudentDetails.js';
import { getAllStudents } from '../controllers/User/GetAllStudents.js';
import { VerifyAdmin } from '../middlewares/CheckAdmin.js';
import { getAllFaculty } from '../controllers/User/GetAllFaculty.js';



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
 *     summary: Update only first name, last name, and profile image of the logged-in user
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
 *                 description: Must be a non-empty string.
 *               lastName:
 *                 type: string
 *                 example: Doe
 *                 description: Must be a non-empty string.
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file.
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User profile not updated
 *       400:
 *         description: Validation error
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


/**
 * @swagger
 * /api/v1/user/add-courses:
 *   put:
 *     summary: Add courses to the logged-in student user
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
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Math", "Physics"]
 *                 description: Must be a non-empty array of non-empty strings.
 *     responses:
 *       200:
 *         description: Courses added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only students can add courses
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/add-courses', verifyToken, addCourses);

/**
 * @swagger
 * /api/v1/user/add-student-details:
 *   put:
 *     summary: Add or update student details for the logged-in student user
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
 *               studentId:
 *                 type: string
 *                 example: CSC22F091
 *                 description: Must be a non-empty string.
 *               department:
 *                 type: string
 *                 example: Computer Science
 *                 description: Must be a non-empty string.
 *               cgpa:
 *                 type: string
 *                 example: "3.0"
 *                 description: Must be a non-empty string.
 *               semester:
 *                 type: string
 *                 enum: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th]
 *                 example: "3rd"
 *                 description: Must be one of the allowed values.
 *     responses:
 *       200:
 *         description: Student details added/updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only students can add student details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/add-student-details', verifyToken, addStudentDetails);


/**
 * @swagger
 * /api/v1/user/all-students:
 *   get:
 *     summary: Get all students from the database
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All students fetched successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/all-students', verifyToken, VerifyAdmin, getAllStudents);

/**
 * @swagger
 * /api/v1/user/all-faculty:
 *   get:
 *     summary: Get all faculty from the database
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All faculty fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All faculty fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/all-faculty', verifyToken, VerifyAdmin, getAllFaculty);

export default router;