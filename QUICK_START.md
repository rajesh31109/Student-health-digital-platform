# Quick Start Guide - Full Stack Development

## 🎯 What's Been Set Up

✅ **Backend API** - Node.js + Express + TypeScript
✅ **Database** - Supabase PostgreSQL
✅ **Frontend** - React + Vite + TypeScript  
✅ **API Client** - Custom HTTP client with authentication
✅ **Custom Hooks** - useAuth and useHealthRecords
✅ **Deployment Configs** - Render + Vercel ready

---

## ✨ Your Next Important Steps

### STEP 1: Set Up Supabase (Database)

1. Go to **https://supabase.com** and create a free account
2. Create a new project
3. Wait for it to initialize (~2 minutes)
4. In **Project Settings → API**, copy:
   - **Project URL** → Save this as `SUPABASE_URL`
   - **Anon Public Key** → Save this as `SUPABASE_KEY`

5. Go to **SQL Editor** in Supabase dashboard
6. Click **New Query**
7. Copy-paste the entire content of `backend/supabase-schema.sql`
8. Click **Run** (or Cmd+Enter)
9. ✅ Your database tables are now created!

---

### STEP 2: Set Up Environment Variables

**Backend**: Create `backend/.env`
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_KEY=YOUR_SUPABASE_KEY_HERE
JWT_SECRET=my-super-secret-dev-key-123456
```

**Frontend**: Create `.env`
```env
VITE_API_URL=http://localhost:3000
```

---

### STEP 3: Run Everything Locally

**Terminal 1 - Start Backend**:
```bash
cd backend
npm run dev
```
✅ Backend runs on `http://localhost:3000`

**Terminal 2 - Start Frontend**:
```bash
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

**Test it with curl**:
```bash
# Test if backend is running
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-03-28T..."}
```

---

### STEP 4: Test the APIs

#### Register a Student
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "rollNumber": "STU001",
    "department": "Computer Science"
  }'
```

Save the `token` from the response!

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

#### Get Your Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create a Health Record
```bash
curl -X POST http://localhost:3000/api/health-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "recordType": "Consultation",
    "description": "Follow-up consultation for checkup",
    "date": "2026-03-28T10:00:00Z"
  }'
```

#### Get Health Records
```bash
curl -X GET http://localhost:3000/api/health-records \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Project Structure

```
project-root/
├── src/                          # React Frontend
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── services/                 # API client
│   │   └── api.ts               # ✨ NEW - HTTP client
│   ├── hooks/                    # Custom React hooks
│   │   └── useApi.ts            # ✨ NEW - Auth & Health Records hooks
│   └── App.tsx
├── backend/                      # ✨ NEW - Express Backend
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth, error handling
│   │   ├── utils/                # Helpers
│   │   ├── config.ts             # Configuration
│   │   └── index.ts              # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── .env                          # Frontend env vars
├── vercel.json                   # Vercel deployment config
├── FULL_STACK_SETUP.md           # Complete deployment guide
├── RENDER_DEPLOYMENT.md          # Render backend deployment
├── VERCEL_CONFIG.md              # Vercel frontend deployment
└── package.json
```

---

## 🚀 Using the API Client in Your Components

### Example: Login Form

```typescript
import { useAuth } from '@/hooks/useApi';

function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password, 'student');
      // Navigate to dashboard
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

### Example: View Health Records

```typescript
import { useHealthRecords } from '@/hooks/useApi';
import { useEffect } from 'react';

function HealthRecordsList() {
  const { records, loading, fetchRecords, deleteRecord } = useHealthRecords();

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {records.map(record => (
            <li key={record.id}>
              <h3>{record.record_type}</h3>
              <p>{record.description}</p>
              <p>{new Date(record.date).toLocaleDateString()}</p>
              <button onClick={() => deleteRecord(record.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 📦 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Health Records
- `GET /api/health-records` - Get all records
- `POST /api/health-records` - Create record
- `PUT /api/health-records/:id` - Update record
- `DELETE /api/health-records/:id` - Delete record

### Health Check
- `GET /api/health` - Server health check

---

## 🌐 Deployment (When Ready)

### Deploy Backend to Render
See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Deploy Frontend to Vercel
See [VERCEL_CONFIG.md](./VERCEL_CONFIG.md)

### Complete Setup Guide
See [FULL_STACK_SETUP.md](./FULL_STACK_SETUP.md)

---

## 🆘 Common Issues & Solutions

### "CORS error" when calling backend from frontend
**Solution**: Make sure `FRONTEND_URL` in `backend/.env` matches exactly

### "Unauthorized" errors
**Solution**: Check that you're sending the token in the header: `Authorization: Bearer YOUR_TOKEN`

### Backend won't start
**Solution**: 
1. Check `.env` file exists in `backend/` folder
2. Make sure `SUPABASE_URL` and `SUPABASE_KEY` are set
3. Run `npm run dev` from the `backend/` directory

### Frontend can't reach backend
**Solution**: Check that `VITE_API_URL` in `.env` is correct and backend is running

---

## 💡 Pro Tips

1. **Use Thunder Client or Postman** to test APIs before integrating into frontend
2. **Check browser DevTools → Network tab** to see actual API calls
3. **Use `localStorage.getItem('authToken')`** in browser console to debug tokens
4. **Logs are your friend**: Check both terminal outputs for errors

---

## 📚 What to Do Next

1. ✅ Set up Supabase (this is critical!)
2. ✅ Create `.env` files
3. ✅ Run backend and frontend
4. ✅ Test APIs with curl
5. ⬜ Update your Login/Register components to use `useAuth` hook
6. ⬜ Update your Dashboard to fetch data using `useHealthRecords` hook
7. ⬜ Replace hardcoded data with real backend data
8. ⬜ Test everything end-to-end locally
9. ⬜ Deploy backend to Render
10. ⬜ Deploy frontend to Vercel

---

**Questions?** Check the detailed guides in the repo or review the code comments!

Happy coding! 🚀
