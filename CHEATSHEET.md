# 🚀 FreshMart Command Cheatsheet

Quick reference for common commands and operations.

## 📦 Installation & Setup

```bash
# Install all dependencies
npm run install:all

# Interactive setup wizard
npm run setup

# Install separately
cd Backend && npm install
cd Frontend && npm install
```

## 🏃 Running the Application

```bash
# Start both backend & frontend
npm run dev

# Start backend only
npm run dev:backend
# or
cd Backend && npm run dev

# Start frontend only
npm run dev:frontend
# or
cd Frontend && npm run dev
```

## 🔨 Building for Production

```bash
# Build both
npm run build

# Build backend only
cd Backend && npm run build

# Build frontend only
cd Frontend && npm run build
```

## 🌐 URLs

```
Backend API:     http://localhost:3000
Backend Health:  http://localhost:3000/health
Frontend:        http://localhost:5173
```

## 🔐 Default Credentials

```
Admin Login:
Email:    admin@freshmart.co.ke
Password: admin123
```

## 🧪 Testing API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@freshmart.co.ke",
    "password": "admin123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl http://localhost:3000/api/products?category=sodas
```

### Create Order (with auth)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "branch": "nairobi",
    "delivery_address": "123 Main St",
    "items": [{
      "product_id": "product-uuid",
      "quantity": 2,
      "price": 50
    }]
  }'
```

## 🗄️ Database Operations

### Open Supabase SQL Editor
1. Go to your Supabase project
2. Click "SQL Editor" in sidebar
3. Click "New query"

### Run Migration
```sql
-- Copy contents of Backend/database/schema.sql
-- Paste in SQL Editor
-- Click "Run"
```

### Check Data
```sql
-- Count products
SELECT COUNT(*) FROM products;

-- List all products
SELECT name, category, price FROM products;

-- Check inventory
SELECT branch, COUNT(*) as products 
FROM inventory 
GROUP BY branch;

-- View admin user
SELECT email, role FROM users WHERE role = 'admin';
```

### Update Admin Password
```bash
# Generate hash
cd Backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

```sql
-- Update in Supabase
UPDATE users 
SET password_hash = 'paste_hash_here'
WHERE email = 'admin@freshmart.co.ke';
```

## 🔧 Troubleshooting

### Clear and Reinstall
```bash
# Backend
cd Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

### Reset Database
```sql
-- In Supabase SQL Editor
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then re-run migration from schema.sql
```

### Check Logs
```bash
# Backend logs
cd Backend
npm run dev
# Watch terminal output

# Frontend logs
cd Frontend
npm run dev
# Check browser console (F12)
```

## 📝 Environment Variables

### Backend (.env)
```bash
cd Backend
cat .env

# Required:
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...

# Optional (M-Pesa):
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
```

### Frontend (.env)
```bash
cd Frontend
cat .env

# Required:
VITE_API_URL=http://localhost:3000/api
```

## 🔑 Generate Secrets

### JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Password Hash
```bash
cd Backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('yourpassword', 10).then(console.log)"
```

## 📊 M-Pesa Testing

### Start ngrok (for callbacks)
```bash
ngrok http 3000
```

### Update callback URL
```env
# In Backend/.env
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/payments/mpesa/callback
```

### Test STK Push
```bash
curl -X POST http://localhost:3000/api/payments/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "order_id": "order-uuid",
    "phone": "254712345678"
  }'
```

## 🚀 Deployment

### Deploy Backend (Railway)
```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push

# In Railway:
# 1. Connect GitHub repo
# 2. Select Backend folder
# 3. Add environment variables
# 4. Deploy
```

### Deploy Frontend (Vercel)
```bash
# Push to GitHub
git add .
git commit -m "Deploy frontend"
git push

# In Vercel:
# 1. Import from GitHub
# 2. Root directory: Frontend
# 3. Framework: Vite
# 4. Add VITE_API_URL environment variable
# 5. Deploy
```

## 📚 Documentation Quick Links

- **Quick Start**: `QUICKSTART.md`
- **Full Setup**: `FULLSTACK_SETUP.md`
- **Backend API**: `Backend/README.md`
- **Database**: `Backend/database/SETUP.md`
- **Implementation**: `IMPLEMENTATION_COMPLETE.md`

## 🎯 Common Tasks

### Add New Product (via SQL)
```sql
INSERT INTO products (name, category, price, image, description, volume, brand)
VALUES ('New Drink', 'sodas', 60, '/images/new.jpg', 'Description', '330ml', 'Brand');
```

### Add New Admin
```bash
# Generate hash first
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password', 10).then(console.log)"
```

```sql
INSERT INTO users (name, email, phone, password_hash, role)
VALUES ('New Admin', 'admin2@example.com', '+254700000000', 'hash_here', 'admin');
```

### Check Order Status
```sql
SELECT id, user_id, total, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Recent Sales
```sql
SELECT 
  o.id,
  u.name as customer,
  o.branch,
  o.total,
  o.status,
  o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'paid'
ORDER BY o.created_at DESC;
```

## 💡 Pro Tips

```bash
# Watch files for changes (backend)
cd Backend && npm run dev
# Uses tsx watch mode

# Open frontend and backend in split terminal
# Use VS Code split terminal or tmux

# Quick test API while coding
# Keep a terminal with curl commands ready

# Monitor Supabase logs
# Go to Supabase → Logs → API Logs

# Check network requests
# Use browser DevTools → Network tab
```

---

**Happy Coding! 🚀**

Need more help? Check the main documentation files!
