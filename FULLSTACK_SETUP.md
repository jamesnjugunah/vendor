# FreshMart Full-Stack Setup Guide

This guide will help you set up both the backend API and frontend application.

## Prerequisites

- Node.js 18+ or Bun
- Supabase account (free tier is fine)
- M-Pesa Daraja API access (optional, for payments)

## Quick Start

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in another terminal)
cd ..
npm install
```

### 2. Set Up Supabase Database

Follow the detailed guide in `backend/database/SETUP.md`:

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Get your API keys
3. Run the SQL migration from `backend/database/schema.sql`
4. This will create all tables and sample data

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_here
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configure Frontend

```bash
# In root directory
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend will run on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Testing the Setup

### 1. Test Backend API

```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Click "Get Started" or "Login"
3. Try admin login:
   - Email: `admin@freshmart.co.ke`
   - Password: `admin123`

### 3. Test Customer Flow

1. Register a new account
2. Browse products in shop
3. Add items to cart
4. Proceed to checkout
5. Create an order

## M-Pesa Integration (Optional)

### Sandbox Setup

1. Go to [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create account and get sandbox credentials
3. Update `backend/.env`:

```env
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=http://localhost:3000/api/payments/mpesa/callback
MPESA_ENVIRONMENT=sandbox
```

### Local Development with Callback

For M-Pesa callbacks to work locally:

1. Install ngrok: `npm install -g ngrok`
2. Start ngrok: `ngrok http 3000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update `MPESA_CALLBACK_URL` in `.env`:
   ```env
   MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/payments/mpesa/callback
   ```
5. Restart backend server

## Project Structure

```
vendor/
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── database/
│   │   ├── schema.sql
│   │   └── SETUP.md
│   └── package.json
│
├── src/                      # React frontend
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── store.ts         # State management
│   └── ...
│
├── package.json             # Frontend dependencies
└── README.md               # This file
```

## Development Workflow

### Making API Changes

1. Update routes in `backend/src/routes/`
2. Test with curl or Postman
3. Update frontend API client in `src/lib/api.ts`
4. Update Zustand store if needed

### Adding New Features

1. **Backend First**:
   - Create route in `backend/src/routes/`
   - Add database tables if needed (run SQL in Supabase)
   - Test endpoints

2. **Frontend**:
   - Add API method in `src/lib/api.ts`
   - Update store in `src/lib/store.ts`
   - Create/update UI components

### Database Changes

1. Write SQL migration
2. Run in Supabase SQL Editor
3. Update TypeScript interfaces in `backend/src/config/database.ts`

## Common Issues

### Backend won't start

**Problem**: `Error: Cannot find module`
```bash
cd backend
npm install
```

**Problem**: Database connection failed
- Check Supabase URL and keys in `.env`
- Verify project is not paused

### Frontend can't connect to API

**Problem**: CORS error
- Check `FRONTEND_URL` in `backend/.env`
- Restart backend server

**Problem**: 401 Unauthorized
- Check if token is being sent
- Try logging out and back in

### M-Pesa callbacks not received

- Use ngrok for local development
- Check callback URL is HTTPS
- Verify URL in Daraja portal matches `.env`

## Production Deployment

### Backend (Railway/Render/Heroku)

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository
3. Set `VITE_API_URL` to production backend URL
4. Deploy

### Database

- Supabase handles database automatically
- No additional setup needed
- Consider upgrading to paid tier for production

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Keep service_role key secret
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Implement request validation

## Next Steps

1. **Add More Products**: Update `database/schema.sql` or add via admin panel
2. **Customize Styling**: Edit Tailwind configuration
3. **Add Features**: 
   - Email notifications
   - Order tracking
   - Customer reviews
   - Delivery status updates
4. **Implement Analytics**: Add tracking for orders, revenue, etc.

## Support

For issues:
- Backend API: Check `backend/README.md`
- Database: Check `backend/database/SETUP.md`
- Frontend: Check main `README.md`

## License

MIT
