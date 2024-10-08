import express from 'express';
import { getProfile, getAllUsers, updateUser, deleteUser, getStatistics } from '../controllers/userController';
import { authMiddleware, managerAuthMiddleware } from '../middleware/authMiddleware';
import { errorHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: קבלת פרופיל המשתמש
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', authMiddleware, errorHandler(getProfile));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: קבלת כל המשתמשים (למנהלים בלבד)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, managerAuthMiddleware, errorHandler(getAllUsers));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: עדכון משתמש (למנהלים בלבד)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', authMiddleware, managerAuthMiddleware, errorHandler(updateUser));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: מחיקת משתמש (למנהלים בלבד)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', authMiddleware, managerAuthMiddleware, errorHandler(deleteUser));

/**
 * @swagger
 * /users/statistics:
 *   get:
 *     summary: קבלת סטטיסטיקות משתמשים (למנהלים בלבד)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', authMiddleware, managerAuthMiddleware, errorHandler(getStatistics));

export default router;