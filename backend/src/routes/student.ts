// Student Routes - Student-only dashboard endpoints
import { Router } from 'express';
import {
  getStudentProfile,
  getStudentHealthRecords,
  getStudentHealthRecord,
  getStudentHealthSummary,
  getStudentNotifications,
  markNotificationAsRead,
  getStudentVisits,
} from '../controllers/studentController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and student role
router.use(authMiddleware);
router.use(requireRole(['student']));

// Get student's own profile
router.get('/profile', getStudentProfile);

// Get student's health records (dashboard - list of all checkups)
router.get('/health-records', getStudentHealthRecords);

// Get specific health record by ID
router.get('/health-records/:id', getStudentHealthRecord);

// Get health summary (conditions, nutrition advice, etc.)
router.get('/health-summary', getStudentHealthSummary);

// Get student's notifications
router.get('/notifications', getStudentNotifications);

// Mark notification as read
router.patch('/notifications/:id/read', markNotificationAsRead);

// Get student visit history
router.get('/visits', getStudentVisits);

export default router;
