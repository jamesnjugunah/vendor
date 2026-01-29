# ✅ Frontend Authentication Connected to Backend

## Changes Made

### 1. Login Page (`Frontend/src/pages/auth/Login.tsx`)
- ✅ Replaced mock login with real API call to `POST /api/auth/login`
- ✅ Stores JWT token in localStorage
- ✅ Updates Zustand store with user data
- ✅ Handles API errors with proper toast messages
- ✅ Maintains redirect functionality after login

### 2. Register Page (`Frontend/src/pages/auth/Register.tsx`)
- ✅ Replaced mock registration with real API call to `POST /api/auth/register`
- ✅ Formats Kenyan phone numbers correctly (+254)
- ✅ Stores JWT token on successful registration
- ✅ Auto-logs in user after registration
- ✅ Handles API errors

### 3. Admin Login Page (`Frontend/src/pages/auth/AdminLogin.tsx`)
- ✅ Connects to backend API
- ✅ Verifies admin role from backend response
- ✅ Stores JWT token
- ✅ Denies access if user is not admin

### 4. Store Updates (`Frontend/src/lib/store.ts`)
- ✅ Logout now clears JWT token from localStorage
- ✅ Imports `clearAuthToken` helper from API module

### 5. Backend CORS Fix (`Backend/src/server.ts`)
- ✅ Updated default CORS origin from 8080 to 5173 (Vite's default port)
- ✅ Allows credentials for JWT authentication

## How It Works

### Login Flow
1. User enters email and password
2. Frontend calls `authApi.login(email, password)`
3. Backend validates credentials
4. Backend returns JWT token and user object
5. Frontend stores token in localStorage
6. Frontend updates Zustand store with user data
7. User is redirected to appropriate page

### Registration Flow
1. User fills registration form
2. Frontend validates password match and phone format
3. Frontend calls `authApi.register(userData)`
4. Backend creates user with hashed password
5. Backend returns JWT token and user object
6. Frontend stores token and logs user in
7. User is redirected to shop

### Protected Routes
- All subsequent API calls automatically include the JWT token in the Authorization header
- Backend validates token for protected endpoints
- Token is stored in localStorage and persists across sessions

## Testing the Authentication

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Backend should start on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
Frontend should start on: http://localhost:5173

### 2. Test Registration

1. Go to http://localhost:5173
2. Click "Register" or "Get Started"
3. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Phone: 0712345678 or +254712345678
   - Password: test123
   - Confirm Password: test123
4. Click "Create Account"
5. Should redirect to shop page with success message

### 3. Test Customer Login

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: test@example.com
   - Password: test123
3. Click "Sign In"
4. Should redirect to shop with "Welcome back!" message

### 4. Test Admin Login

1. Go to http://localhost:5173/admin/login
2. Enter admin credentials:
   - Email: admin@freshmart.co.ke
   - Password: admin123
3. Click "Sign In as Admin"
4. Should redirect to admin dashboard

### 5. Test Logout

1. While logged in, click user menu
2. Click "Logout"
3. Should clear token and redirect to home
4. Try accessing protected pages - should redirect to login

## API Endpoints Being Used

### Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+254712345678",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

### Register
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "+254712345678",
  "password": "password123"
}

Response: Same as login
```

## Troubleshooting

### "Network Error" or CORS Issues
- Make sure backend is running on port 3000
- Check Backend/.env has correct FRONTEND_URL
- Check browser console for specific CORS errors

### "Invalid credentials" on admin login
- Verify admin user exists in database
- Check password hash is correct (see QUICKSTART.md)
- Try registering as regular user first to test DB connection

### Token not persisting
- Check browser localStorage (F12 → Application → Local Storage)
- Should see `auth_token` key
- Should also see `supermarket-storage` with user data

### 401 Unauthorized on protected routes
- Token might be expired or invalid
- Try logging out and back in
- Check backend logs for JWT verification errors

## Next Steps

Now that authentication is connected, you can:

1. ✅ **Protected Routes**: Add route guards to protect customer/admin pages
2. ✅ **API Integration**: Connect other features (products, orders, cart) to backend
3. ✅ **Token Refresh**: Implement token refresh logic for expired tokens
4. ✅ **Profile Page**: Use `authApi.updateProfile()` for profile updates
5. ✅ **Error Handling**: Add global error interceptor for 401/403 responses

## Security Notes

- ✅ Passwords are hashed with bcrypt on backend
- ✅ JWT tokens are used for authentication
- ✅ Tokens stored in localStorage (consider httpOnly cookies for production)
- ✅ Backend validates all requests with JWT middleware
- ⚠️ Remember to use HTTPS in production
- ⚠️ Set strong JWT_SECRET in production
- ⚠️ Implement token refresh for better security

---

**Your authentication is now fully connected! 🎉**

Test it out and you should see real API calls in the Network tab (F12).
