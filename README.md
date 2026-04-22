# 🏥 Student Health Digital Platform

A comprehensive digital health management system for students with role-based access control (Admin, Medical Officer, Student).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (configured)

### Installation

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase credentials
```

### Local Development

**Terminal 1 - Backend (Port 3001):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Port 8080):**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001/api
- Debug Page: http://localhost:8080/debug

## 🔐 Authentication & Credentials

### Admin Login
- **Email:** rajeshpulluri333@gmail.com
- **Password:** admin123

### Features
- ✅ **Admin Dashboard** - Full system control
- ✅ **Medical Officer Portal** - Health record management
- ✅ **Student Portal** - View personal health records
- ✅ **PDF Export** - Generate health reports
- ✅ **Real-time Statistics** - System analytics

## 📁 Project Structure

```
Student-health-digital-platform/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, error handling
│   │   ├── utils/             # Helpers (JWT, passwords, Supabase)
│   │   ├── config.ts          # Environment config
│   │   └── index.ts           # Express server
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API calls
│   │   ├── hooks/             # Custom React hooks
│   │   ├── config/            # App configuration
│   │   └── lib/               # Utilities
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── package.json               # Root package.json
├── vercel.json               # Vercel deployment config
└── render.yaml               # Render deployment config
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/mo-login` - Medical Officer login
- `POST /api/auth/student-login` - Student login
- `GET /api/auth/profile` - Get user profile (requires token)
- `POST /api/auth/logout` - Logout
- `GET /api/health` - Health check endpoint

## 🌐 Deployment

### Render Backend
Environment variables configured automatically with credentials provided during setup.

### Vercel Frontend
```bash
# Environment Variable Required
VITE_API_URL=https://student-health-backend.onrender.com
```

## 🔒 Security Features

- JWT Token-based Authentication
- Password Hashing with Bcrypt
- Row-Level Security (RLS) on Supabase
- Role-Based Access Control (RBAC)
- CORS Protection
- Input Validation with Zod

## 🧪 Testing

### Test Backend Locally
```bash
# Health check
curl http://localhost:3001/api/health

# Admin login
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}'
```

## 🐛 Troubleshooting

### Backend not responding
1. Check backend status: `curl http://localhost:3001/api/health`
2. Verify environment variables are set
3. Check backend logs for errors
4. Rebuild: `cd backend && npm run build`

### Login failed
1. Visit http://localhost:8080/debug
2. Check if backend health status shows ✅
3. Verify admin credentials
4. Check browser console for errors

## 📚 Documentation

- [System Architecture](ARCHITECTURE.md) - Detailed system design

## ⚖️ License

Proprietary - All rights reserved

---

**Status:** ✅ Production Ready
