// Simplified Role-Based Auth Routes
import { Router } from 'express';
import {
  loginStudent,
  loginMedicalOfficer,
  loginAdmin,
  getProfile,
  logout,
  getHomepageStatistics,
} from '../controllers/roleAuthController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// =====================================================================
// PUBLIC ROUTES (No authentication required)
// =====================================================================
// Get homepage statistics (for landing page)
router.get('/homepage-statistics', getHomepageStatistics);

// =====================================================================
// STUDENT ROUTES
// =====================================================================
// Login with Health ID only (no password)
router.post('/student-login', loginStudent);

// =====================================================================
// MEDICAL OFFICER ROUTES  
// =====================================================================
// Login with Email + Password (simplified - OTP can be added later)
router.post('/mo-login', loginMedicalOfficer);

// =====================================================================
// ADMIN ROUTES
// =====================================================================
// Login with Email + Password
router.post('/admin-login', loginAdmin);

// =====================================================================
// SHARED ROUTES (All require JWT token)
// =====================================================================
// Get current user profile (works for all roles)
router.get('/profile', authMiddleware, getProfile);

// Logout
router.post('/logout', authMiddleware, logout);

export default router;
