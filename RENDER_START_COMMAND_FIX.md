# 🔧 Render Start Command Fix

## ❌ Current Error

```
Error: Cannot find module '/opt/render/project/src/dist/index.js'
```

**Reason**: The start command doesn't know where to find the compiled backend code.

---

## ✅ Solution

### Fix in Render Dashboard

1. Go to your Render Service: **student-health-backend**
2. Click **Settings** (top menu)
3. Find **Start Command** field
4. **Change from**:
```bash
node dist/index.js
```

5. **Change to**:
```bash
cd backend && node dist/index.js
```

6. Click **Save**
7. Service will automatically redeploy

---

## 📝 Why This Works

- **Build Command**: `cd backend && npm install && npm run build`
  - Creates: `/opt/render/project/backend/dist/index.js`

- **Old Start Command**: `node dist/index.js`
  - Looked for: `/opt/render/project/dist/index.js` (❌ doesn't exist)

- **New Start Command**: `cd backend && node dist/index.js`
  - Looks for: `/opt/render/project/backend/dist/index.js` (✅ correct location)

---

## 🚀 What Happens After Fix

1. Render saves the new start command
2. Service automatically redeploys
3. TypeScript compiled code runs correctly
4. Backend should start with: `🚀 Server running on port 3000`

---

## ✅ Verification

After the fix, check:
1. Render dashboard shows **"Live"** status (green)
2. Logs show: `🚀 Server running on port 3000`
3. Test endpoint: `https://student-health-backend.onrender.com/api/health`

---

**Status**: Fix ready to apply  
**Next Step**: Update start command in Render Settings and redeploy
