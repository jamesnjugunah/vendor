# 🚀 FreshMart Quick Start Guide

Get your full-stack application running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)

## 🎯 Step-by-Step Setup

### 1️⃣ Install Dependencies (2 min)

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# OR install separately:
cd Backend && npm install
cd ../Frontend && npm install
```

### 2️⃣ Set Up Supabase Database (3 min)

1. **Create Project**:
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click "New Project"
   - Name: `freshmart` | Choose a password | Select region
   - Wait 2-3 minutes for project creation

2. **Get API Keys**:
   - In your project: Settings → API
   - Copy: **Project URL**, **anon public** key, **service_role** key

3. **Run Database Migration**:
   - In Supabase: Go to SQL Editor
   - Click "New query"
   - Open `Backend/database/schema.sql`
   - Copy all content → Paste in SQL Editor
   - Click "Run"
   - ✅ You should see "Success" message

### 3️⃣ Configure Environment Variables (1 min)

**Backend:**
```bash
cd Backend
cp .env.example .env
```

Edit `Backend/.env` (use your Supabase keys):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=any_random_string_here
```

**Frontend:**
```bash
cd Frontend
cp .env.example .env
```

Edit `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Fix Admin Password (1 min)

The admin password needs to be hashed. Run this:

```bash
cd Backend
npm install
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Copy the hash output, then in Supabase SQL Editor:

```sql
UPDATE users 
SET password_hash = 'paste_the_hash_here'
WHERE email = 'admin@freshmart.co.ke';
```

### 5️⃣ Start Development Servers

**Option A: Run Both Together (Recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd Backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd Frontend
npm run dev
```

## ✅ Verify Setup

1. **Backend Health Check**:
   - Open: http://localhost:3000/health
   - Should show: `{"status":"ok",...}`

2. **Frontend**:
   - Open: http://localhost:5173
   - Click "Login"

3. **Test Admin Login**:
   - Email: `admin@freshmart.co.ke`
   - Password: `admin123`
   - Should redirect to admin dashboard

4. **Test Customer Flow**:
   - Click "Register" → Create account
   - Browse shop → Add items to cart
   - Go to cart → Checkout

## 🎉 You're Done!

Your full-stack app is now running!

### What You Have:

- ✅ Express backend API (http://localhost:3000)
- ✅ React frontend (http://localhost:5173)
- ✅ Supabase PostgreSQL database
- ✅ JWT authentication
- ✅ 12 sample products
- ✅ Admin dashboard
- ✅ Customer shop interface

## 📚 Next Steps

### Optional: M-Pesa Integration

If you want to test payments:

1. Get Daraja API credentials from [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Update `Backend/.env`:
   ```env
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your_passkey
   MPESA_CALLBACK_URL=http://localhost:3000/api/payments/mpesa/callback
   MPESA_ENVIRONMENT=sandbox
   ```
3. For local testing, use ngrok: `ngrok http 3000`

### Customize Your App

- **Add Products**: Login as admin → Products section
- **Change Styling**: Edit `Frontend/tailwind.config.ts`
- **Add Features**: Check `Backend/README.md` for API docs

## 🐛 Troubleshooting

### Backend won't start
```bash
cd Backend
rm -rf node_modules
npm install
```

### Frontend can't connect
- Check `VITE_API_URL` in `Frontend/.env`
- Make sure backend is running
- Check browser console for errors

### Database errors
- Verify Supabase keys in `Backend/.env`
- Check if project is paused (free tier limitation)
- Re-run migration in SQL Editor

### Login fails
- Make sure you updated admin password hash
- Clear browser localStorage
- Check backend logs

## 📞 Get Help

- Backend API docs: `Backend/README.md`
- Database setup: `Backend/database/SETUP.md`
- Full guide: `FULLSTACK_SETUP.md`

---

**Happy Coding! 🚀**
