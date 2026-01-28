# FreshMart Backend API

Express.js + TypeScript backend for FreshMart e-commerce application with Supabase database and M-Pesa payment integration.

## Features

- 🔐 JWT Authentication
- 👤 User Management (Customer & Admin roles)
- 🛍️ Product CRUD
- 📦 Order Management
- 📊 Inventory Tracking
- 💰 M-Pesa STK Push Integration
- 🗄️ Supabase PostgreSQL Database

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Payment**: M-Pesa Daraja API

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- M-Pesa Daraja API credentials (optional for payment features)

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials (see `database/SETUP.md` for details)

3. **Set up database**:
   - Follow instructions in `database/SETUP.md`
   - Run the SQL migration in Supabase SQL Editor

4. **Start development server**:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### **Auth**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login and get JWT token |
| GET | `/auth/me` | Yes | Get current user |
| PUT | `/auth/profile` | Yes | Update user profile |

**Register Example**:
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254712345678",
  "password": "secure123"
}

Response:
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### **Products**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | No | Get all products (filter by category/search) |
| GET | `/products/:id` | No | Get single product |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

**Get Products Example**:
```json
GET /api/products?category=sodas&search=cola

Response:
{
  "products": [...]
}
```

#### **Orders**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Yes | Create new order |
| GET | `/orders` | Yes | Get user's orders |
| GET | `/orders/:id` | Yes | Get single order |
| GET | `/orders/admin/all` | Admin | Get all orders |
| PATCH | `/orders/:id/status` | Yes | Update order status |

**Create Order Example**:
```json
POST /api/orders
{
  "branch": "nairobi",
  "delivery_address": "123 Main St, Nairobi",
  "items": [
    {
      "product_id": "uuid-here",
      "quantity": 2,
      "price": 50
    }
  ]
}

Response:
{
  "order": { ... }
}
```

#### **Inventory**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/inventory/:branch` | No | Get branch inventory |
| POST | `/inventory/restock` | Admin | Transfer stock between branches |
| PUT | `/inventory/:branch/:product_id` | Admin | Update inventory quantity |

**Restock Example**:
```json
POST /api/inventory/restock
{
  "from_branch": "nairobi",
  "to_branch": "kisumu",
  "product_id": "uuid-here",
  "quantity": 50
}
```

#### **Payments (M-Pesa)**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/mpesa/stk-push` | Yes | Initiate M-Pesa payment |
| POST | `/payments/mpesa/callback` | No | M-Pesa callback (webhook) |
| GET | `/payments/mpesa/query/:id` | Yes | Query transaction status |

**Initiate Payment Example**:
```json
POST /api/payments/mpesa/stk-push
{
  "order_id": "order-uuid",
  "phone": "0712345678"
}

Response:
{
  "message": "Payment initiated. Please check your phone.",
  "checkoutRequestId": "ws_CO_xxx",
  "merchantRequestId": "xxx"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Supabase configuration
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── products.ts          # Product endpoints
│   │   ├── orders.ts            # Order endpoints
│   │   ├── inventory.ts         # Inventory endpoints
│   │   └── payments.ts          # M-Pesa endpoints
│   ├── services/
│   │   └── mpesaService.ts      # M-Pesa integration
│   └── server.ts                # Express app
├── database/
│   ├── schema.sql               # Database schema
│   └── SETUP.md                 # Setup instructions
├── .env.example                 # Environment template
├── package.json
└── tsconfig.json
```

## Environment Variables

See `.env.example` for all required variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for signing JWT tokens
- `MPESA_*` - M-Pesa Daraja API credentials

## Development

### Watch Mode
```bash
npm run dev
```

### Type Checking
```bash
npx tsc --noEmit
```

## Deployment

### Railway / Render / Heroku

1. Set environment variables in platform dashboard
2. Deploy from GitHub
3. Run database migration in Supabase

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT token authentication
- ✅ Supabase RLS policies
- ✅ CORS configured
- ✅ Environment variables for secrets
- ⚠️ Use HTTPS in production
- ⚠️ Rate limiting recommended
- ⚠️ Input validation with Zod

## Troubleshooting

### "Authentication required" error
- Ensure JWT token is included in Authorization header
- Token format: `Bearer <token>`

### Supabase connection failed
- Verify SUPABASE_URL and keys
- Check project is not paused

### M-Pesa callback not working
- Use ngrok for local development
- Update callback URL in Daraja portal
- Check logs for callback payload

## License

MIT
