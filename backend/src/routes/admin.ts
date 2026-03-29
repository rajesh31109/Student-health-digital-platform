// Admin Routes - Admin dashboard endpoints (DMHO)
import { Router } from 'express';
import {
  getAllStudents,
  getAllHealthRecords,
  getAllMedicalOfficers,
  createMedicalOfficer,
  getDashboardStatistics,
  getAuditLogs,
  generateReport,
  toggleMOStatus,
  toggleStudentStatus,
} from '../controllers/adminController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(requireRole(['admin']));

// Dashboard Statistics (main dashboard overview)
router.get('/dashboard/statistics', getDashboardStatistics);

// Get all students (with optional filtering)
router.get('/students', getAllStudents);

// Get all health records
router.get('/health-records', getAllHealthRecords);

// Get all medical officers
router.get('/medical-officers', getAllMedicalOfficers);

// Create a new medical officer
router.post('/medical-officers', createMedicalOfficer);

// Toggle MO's active status (enable/disable)
router.patch('/medical-officers/:id/status', toggleMOStatus);

// Toggle Student's active status (enable/disable)
router.patch('/students/:id/status', toggleStudentStatus);

// Get audit logs (system activity tracking)
router.get('/audit-logs', getAuditLogs);

// Generate reports (health-related data export)
router.get('/reports', generateReport);

export default router;
