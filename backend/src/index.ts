import express from 'express';
import cors from 'cors';
import { env } from './config.js';
import roleAuthRoutes from './routes/roleAuth.js';
import studentRoutes from './routes/student.js';
import medicalOfficerRoutes from './routes/medicalOfficer.js';
import adminRoutes from './routes/admin.js';
import healthRecordsRoutes from './routes/healthRecords.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(express.json());

// Very permissive CORS for development - allow all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api/auth', roleAuthRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/mo', medicalOfficerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health-records', healthRecordsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📦 Frontend URL: ${env.FRONTEND_URL}`);
  console.log(`✅ Backend accessible at http://localhost:${PORT}`);
});

export default app;
