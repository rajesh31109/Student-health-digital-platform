import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Validate required env vars
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
for (const varName of requiredEnvVars) {
  if (!env[varName as keyof typeof env]) {
    console.warn(`⚠️  Missing environment variable: ${varName}`);
  }
}
