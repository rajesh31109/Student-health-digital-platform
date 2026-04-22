import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_NAME: process.env.ADMIN_NAME || 'DMHO',
};

const requiredEnvVars = ['SUPABASE_URL'];
for (const varName of requiredEnvVars) {
  if (!env[varName as keyof typeof env]) {
    console.warn(`⚠️  Missing environment variable: ${varName}`);
  }
}

if (!env.SUPABASE_KEY && !env.SUPABASE_SERVICE_KEY) {
  console.warn('⚠️  Missing Supabase key: set SUPABASE_KEY or SUPABASE_SERVICE_KEY');
}
