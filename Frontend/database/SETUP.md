# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: freshmart
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to Kenya (e.g., Singapore or Europe)
5. Click "Create new project"
6. Wait for project to be created (2-3 minutes)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy entire content from `backend/database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" button
6. Wait for success message

## Step 4: Configure Backend Environment

1. Copy `backend/.env.example` to `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Update `backend/.env` with your values:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   JWT_SECRET=your_random_secret_key_here
   ```

3. Generate a secure JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 5: Configure M-Pesa (Optional)

### Sandbox Setup (Testing):

1. Go to [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an account and log in
3. Create a new app (sandbox)
4. Get your credentials:
   - Consumer Key
   - Consumer Secret
   - Test credentials (shortcode, passkey)

5. Update `backend/.env`:
   ```env
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your_passkey
   MPESA_CALLBACK_URL=http://localhost:3000/api/payments/mpesa/callback
   MPESA_ENVIRONMENT=sandbox
   ```

### Production Setup:

1. Complete Safaricom M-Pesa Go-Live process
2. Get production credentials
3. Update environment to `production`
4. Use your production callback URL (must be HTTPS)

## Step 6: Verify Database

Run this in SQL Editor to verify data:

```sql
-- Check products
SELECT COUNT(*) FROM products;
-- Should return 12

-- Check inventory
SELECT branch, COUNT(*) FROM inventory GROUP BY branch;
-- Should show 12 products per branch

-- Check admin user
SELECT email, role FROM users WHERE role = 'admin';
-- Should show admin@freshmart.co.ke
```

## Step 7: Test Admin Login

**Important**: You need to hash a new password for the admin user.

Run this in your backend terminal after starting the server:

```bash
cd backend
npm install
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Copy the hash and run in SQL Editor:

```sql
UPDATE users 
SET password_hash = 'paste_hash_here'
WHERE email = 'admin@freshmart.co.ke';
```

## Troubleshooting

### Connection Issues:
- Verify SUPABASE_URL doesn't have trailing slash
- Check API keys are correct
- Ensure project is not paused

### RLS Policies Not Working:
- Make sure you're using service_role key in backend
- RLS is bypassed with service_role key

### M-Pesa Callback Not Receiving:
- For local development, use ngrok: `ngrok http 3000`
- Update MPESA_CALLBACK_URL to ngrok URL
- Update callback URL in Daraja portal

## Security Notes

- **Never commit `.env` file**
- Keep `service_role` key secret
- Use environment variables in production
- Enable RLS policies for production
- Use HTTPS in production
