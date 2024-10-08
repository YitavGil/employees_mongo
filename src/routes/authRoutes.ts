import express from 'express';
import { register, login } from '../controllers/authController';
import { errorHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: הרשמת משתמש חדש
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [employee, manager]
 *     responses:
 *       200:
 *         description: המשתמש נרשם בהצלחה
 */
router.post('/register', errorHandler(register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: התחברות משתמש
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: התחברות הצליחה
 */
router.post('/login', errorHandler(login));

export default router;
