# Backend Setup Guide

## Overview

This is a Node.js + Express + TypeScript backend for the Student Health Digital Platform, providing REST APIs for student health management.

## Directory Structure

```
backend/
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── config.ts                # Environment configuration
│   ├── controllers/             # Business logic for each role
│   │   ├── roleAuthController.ts       # Authentication logic
│   │   ├── studentController.ts        # Student operations
│   │   ├── medicalOfficerController.ts # MO operations
│   │   └── adminController.ts          # Admin operations
│   ├── routes/                  # API route definitions
│   │   ├── roleAuth.ts          # Auth routes
│   │   ├── student.ts           # Student dashboard routes
│   │   ├── medicalOfficer.ts    # MO dashboard routes
│   │   └── admin.ts             # Admin dashboard routes
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts              # JWT token verification
│   │   └── errorHandler.ts      # Error handling
│   ├── utils/                   # Utility functions
│   │   ├── jwt.ts               # JWT token generation/verification
│   │   ├── password.ts          # Password hashing (bcrypt)
│   │   ├── supabase.ts          # Supabase client initialization
│   │   ├── studentID.ts         # Student ID generation
│   │   └── auditLog.ts          # Audit logging
│   └── database/
│       └── supabase-schema-v2.sql # Database schema
├── dist/                        # Compiled JavaScript (after build)
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── API_DOCUMENTATION.md         # API endpoint documentation
```

## Prerequisites

- Node.js 18+ (with npm or bun)
- Supabase account and project
- Git

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
# or with bun:
bun install
```

### 2. Setup Environment Variables

```bash
# Copy the example to create your .env file
cp .env.example .env

# Edit .env and add your configuration:
# - SUPABASE_URL (from Supabase dashboard)
# - SUPABASE_KEY (from Supabase dashboard)
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - FRONTEND_URL (http://localhost:5173 for development)
```

### 3. Setup Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing one
3. Get your URL and Key from **Project Settings > API**
4. Run the database schema:
   - Open SQL Editor in Supabase
   - Copy entire contents of `backend/src/database/supabase-schema-v2.sql`
   - Paste and execute in SQL Editor

This creates:
- 9 tables (admins, medical_officers, students, health_records, etc.)
- 18 indexes for performance
- Row-level security (RLS) policies
- 3 useful views

### 4. Create Initial Admin User

After database is set up, create the admin user:

```sql
-- In Supabase SQL Editor, run:
INSERT INTO admins (email, password_hash, name, created_at)
VALUES (
  'rajeshpulluri333@gmail.com',
  'use bcrypt hash of admin123 here',  -- Hash the password!
  'DMHO',
  NOW()
);
```

Or use the API registration endpoint once backend is running.

## Running the Backend

### Development Mode (with auto-reload)

```bash
npm run dev
```

This starts the server with file watching. Any changes to `src/` will auto-reload.

Server will be available at: **http://localhost:3001**

### Production Build

```bash
# Compile TypeScript to JavaScript
npm run build

# Run the compiled version
npm start
```

## API Testing

### Health Check Endpoint

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

### Student Login (Example)

```bash
curl -X POST http://localhost:3001/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"healthId":"TG-01-1968-0001"}'
```

See **API_DOCUMENTATION.md** for all endpoints and examples.

## Available Scripts

```bash
npm run dev      # Development with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled backend
npm run lint     # Check code quality
npm run test     # Run tests
```

## Authentication Flow

### 1. Client sends login request
```
POST /api/auth/student-login
POST /api/auth/mo-login
POST /api/auth/admin-login
```

### 2. Server verifies credentials and returns JWT token
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Client includes token in subsequent requests
```
GET /api/student/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 4. Server verifies token and processes request
```json
{
  "success": true,
  "data": { ... }
}
```

## Key Features

- ✅ **Role-Based Access Control** - Student, Medical Officer, Admin roles with different permissions
- ✅ **JWT Authentication** - Secure token-based auth with 7-day expiration
- ✅ **Password Hashing** - bcrypt for secure password storage
- ✅ **Unique Student IDs** - Auto-generated (TG-01-1968-XXXX format)
- ✅ **Input Validation** - Zod schemas validate all requests
- ✅ **Error Handling** - Consistent error responses
- ✅ **CORS Enabled** - Allows requests from frontend
- ✅ **Audit Logging** - Track all user actions

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:
```bash
# Change PORT in .env file to another port (e.g., 3002)
PORT=3002
```

### Supabase Connection Error

Check that:
- `SUPABASE_URL` is correct (e.g., `https://xxxx.supabase.co`)
- `SUPABASE_KEY` is correct
- You have internet connection
- Supabase project is active

### CORS Issues

Make sure `FRONTEND_URL` in .env matches your frontend's actual URL:
```bash
# Development
FRONTEND_URL=http://localhost:5173

# Production
FRONTEND_URL=https://yourdomain.com
```

### Database Schema Not Found

If you get "table not found" errors, make sure you:
1. Ran the `supabase-schema-v2.sql` script
2. Selected the correct database
3. Waited for schema creation to complete

## Production Deployment

### Environment Variables

Update `.env` with production values:
```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key
JWT_SECRET=use_a_strong_random_key_32+_chars
```

### Deploy to Hosting

Options:
- **Vercel** - Best for Node.js, auto-deploys from Git
- **Railway** - Simple deployment with GitHub integration
- **Heroku** - Full platform, good for full-stack apps
- **AWS/GCP/Azure** - More control, more complex

### CI/CD Pipeline

Add GitHub Actions to auto-build and test:
```yaml
# .github/workflows/backend.yml
name: Backend Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

## Security Best Practices

1. **Use strong JWT secret** - At least 32 random characters
2. **Keep .env secret** - Never commit to git (use .env.example)
3. **Use HTTPS in production** - Always encrypt in transit
4. **Validate all inputs** - Using Zod schemas
5. **Rate limiting** - Add middleware to prevent abuse
6. **HTTPS only** - Use secure cookies and headers
7. **Regular updates** - Keep dependencies up to date

## Support & Documentation

- **API Docs:** See `API_DOCUMENTATION.md`
- **Database Schema:** See `src/database/supabase-schema-v2.sql`
- **Issues:** Check GitHub issues or create new one
- **Contact:** Development team

---

**Last Updated:** January 2024
**Version:** 1.0.0
