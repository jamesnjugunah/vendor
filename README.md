# 🛒 FreshMart - Distributed Supermarket Chain

> Full-stack e-commerce application with Express backend, React frontend, Supabase database, and M-Pesa payment integration.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

## 📖 Project Overview

A distributed web application for managing a supermarket chain with headquarters in Nairobi and four branches across Kenya (Kisumu, Mombasa, Nakuru, Eldoret). The system enables customer purchases, inventory management, sales reporting, and M-Pesa payment integration.

## 🚀 Quick Start

**Get started in 5 minutes** → See [QUICKSTART.md](QUICKSTART.md)

```bash
# 1. Install dependencies
npm run install:all

# 2. Set up Supabase (follow QUICKSTART.md)

# 3. Configure .env files (Backend & Frontend)

# 4. Start both servers
npm run dev
```

## ✨ Features

### 👥 Customer Features
- User registration and authentication with JWT
- Browse products by category (Sodas, Energy Drinks, Juice, Water)
- Shopping cart with real-time updates
- Multi-branch support
- Delivery address with location pin
- M-Pesa STK Push payment integration
- Order history and tracking

### 🔐 Admin Features
- Centralized inventory management
- Restock branches from headquarters
- Product CRUD operations
- Order management across all branches
- Comprehensive sales reporting:
  - Sales by product and category
  - Revenue by branch
  - Order status tracking
  - Real-time dashboard

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  - Vite + TypeScript + TailwindCSS + shadcn/ui          │
│  - Zustand State Management                              │
└─────────────────┬───────────────────────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────────────────────┐
│                  Backend (Express + TS)                  │
│  - JWT Authentication                                    │
│  - RESTful API                                           │
│  - M-Pesa Integration                                    │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Database (Supabase)                     │
│  - PostgreSQL with Row Level Security                   │
│  - Real-time subscriptions ready                        │
└─────────────────────────────────────────────────────────┘
```

### 📍 Branch Locations
- **Headquarters**: Nairobi (main inventory hub)
- **Branches**: Kisumu, Mombasa, Nakuru, Eldoret

### 📦 Product Categories
- Sodas (Coca-Cola, Fanta, Sprite, Pepsi)
- Energy Drinks (Monster, Red Bull)
- Juices (Orange, Apple, Lemonade, Iced Tea)
- Water & Sports Drinks (Mineral Water, Gatorade)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Payment**: M-Pesa Daraja API

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State**: Zustand with persistence
- **Routing**: React Router v6
- **Forms**: React Hook Form

### DevOps
- **Package Manager**: npm / bun
- **Build Tool**: Vite (Frontend) + tsc (Backend)
- **Environment**: dotenv

## 📁 Project Structure

```
vendor/
├── Backend/                     # Express API Server
│   ├── src/
│   │   ├── config/             # Database, env configs
│   │   ├── middleware/         # Auth, error handling
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # Business logic
│   │   └── server.ts           # Entry point
│   ├── database/
│   │   ├── schema.sql          # Database migration
│   │   └── SETUP.md            # DB setup guide
│   └── README.md
│
├── Frontend/                    # React Application
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Route pages
│   │   ├── lib/
│   │   │   ├── api.ts         # API client
│   │   │   └── store.ts       # State management
│   │   └── App.tsx
│   └── vite.config.ts
│
├── QUICKSTART.md               # 5-minute setup guide
├── FULLSTACK_SETUP.md          # Detailed guide
└── README.md                   # This file
```

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up Supabase database (see QUICKSTART.md)

# 3. Configure environment variables
cd Backend && cp .env.example .env
cd ../Frontend && cp .env.example .env

# 4. Start both servers
npm run dev
```

**Detailed guide**: See [QUICKSTART.md](QUICKSTART.md)

## 🔐 Default Credentials

**Admin:**
- Email: `admin@freshmart.co.ke`
- Password: `admin123`

## 💳 M-Pesa Integration

- Supports STK Push for seamless payments
- Webhook callback for transaction verification
- Sandbox and production modes
- See [Backend/README.md](Backend/README.md) for setup

## 📚 Documentation

- [**Quick Start**](QUICKSTART.md) - 5-minute setup
- [**Full Setup Guide**](FULLSTACK_SETUP.md) - Detailed instructions
- [**Backend API**](Backend/README.md) - API documentation
- [**Database Setup**](Backend/database/SETUP.md) - Database guide

## 🚀 Deployment

### Backend
- Deploy to Railway, Render, or Heroku
- Set environment variables in platform
- Database hosted on Supabase

### Frontend
- Deploy to Vercel or Netlify
- Set `VITE_API_URL` to production backend

## 📄 License

MIT

---

**Built with ❤️ in Kenya 🇰🇪**

[Specify your license here]

## Contact

For technical support or business inquiries, please contact:
[Your contact information]

---

**Note**: This system uses the M-Pesa Sandbox environment for demonstration purposes. For production deployment, configure production M-Pesa credentials and ensure compliance with all payment processing regulations.
