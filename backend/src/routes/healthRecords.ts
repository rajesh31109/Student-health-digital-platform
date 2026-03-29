import { Router } from 'express';
import {
  getHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} from '../controllers/healthRecordController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getHealthRecords);
router.post('/', authMiddleware, createHealthRecord);
router.put('/:id', authMiddleware, updateHealthRecord);
router.delete('/:id', authMiddleware, deleteHealthRecord);

export default router;
