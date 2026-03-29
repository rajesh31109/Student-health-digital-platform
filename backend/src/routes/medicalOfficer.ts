// Medical Officer Routes - MO dashboard endpoints
import { Router } from 'express';
import {
  getAllStudentsAtPHC,
  createHealthRecord,
  updateHealthRecord,
  registerStudent,
  bulkRegisterStudents,
  getMOStatistics,
} from '../controllers/medicalOfficerController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and medical officer role
router.use(authMiddleware);
router.use(requireRole(['medical_officer']));

// Get all students at this MO's PHC
router.get('/students', getAllStudentsAtPHC);

// Register a new student
router.post('/students/register', registerStudent);

// Bulk register students (CSV upload)
router.post('/students/bulk-register', bulkRegisterStudents);

// Create health record for a student
router.post('/health-records', createHealthRecord);

// Update health record for a student
router.patch('/health-records/:id', updateHealthRecord);

// Get MO's statistics (students registered, checkups this month, etc.)
router.get('/statistics', getMOStatistics);

export default router;
