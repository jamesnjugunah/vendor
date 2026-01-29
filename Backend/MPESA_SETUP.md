# M-Pesa Integration Setup Guide

## Overview
This guide will help you integrate M-Pesa STK Push payments into your application using Safaricom's Daraja API.

---

## Step 1: Create Daraja Account

1. Visit [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Click **Sign Up** and create an account
3. Verify your email address
4. Log in to the portal

---

## Step 2: Create Sandbox App

1. In the Daraja portal, go to **My Apps**
2. Click **Add a new app**
3. Fill in app details:
   - **App Name**: FreshMart Payments
   - **Description**: M-Pesa payment integration
4. Select **Lipa Na M-Pesa Online** API
5. Click **Create App**
6. Your app will be created and you'll see your credentials

---

## Step 3: Get Sandbox Credentials

From your app page, copy these values:

### Consumer Key
```
Your consumer key will look like: xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Consumer Secret
```
Your consumer secret will look like: xxxxxxxxxxxxxxxxxxxxx
```

### Test Credentials (Sandbox)
- **Shortcode**: `174379` (default sandbox shortcode)
- **Passkey**: Check the [Test Credentials page](https://developer.safaricom.co.ke/test_credentials)
- **Test Phone**: `254708374149`
- **Test PIN**: `1234`

---

## Step 4: Expose Your Local Server

M-Pesa needs to send callbacks to your server. Use **ngrok** to expose your local backend:

### Install ngrok
1. Download from [ngrok.com/download](https://ngrok.com/download)
2. Extract and add to your PATH (optional)

### Start ngrok
```bash
# In a new terminal window
ngrok http 3000
```

### Copy the ngrok URL
You'll see output like:
```
Forwarding    https://abcd-1234-5678.ngrok-free.app -> http://localhost:3000
```

Copy the `https://...ngrok-free.app` URL.

---

## Step 5: Configure Backend Environment

1. Create `.env` file in the `Backend` folder (if not exists):
   ```bash
   cp .env.example .env
   ```

2. Update the M-Pesa section in `.env`:
   ```env
   # M-Pesa Configuration
   MPESA_ENVIRONMENT=sandbox
   MPESA_CONSUMER_KEY=paste_your_consumer_key_here
   MPESA_CONSUMER_SECRET=paste_your_consumer_secret_here
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=paste_your_passkey_here
   MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/payments/mpesa/callback
   ```

   Replace:
   - `paste_your_consumer_key_here` with your Consumer Key
   - `paste_your_consumer_secret_here` with your Consumer Secret
   - `paste_your_passkey_here` with your Passkey
   - `https://your-ngrok-url.ngrok-free.app` with your actual ngrok URL

---

## Step 6: Restart Backend Server

```bash
# In the backend terminal
# Press Ctrl+C to stop
npm run dev
```

---

## Step 7: Test the Integration

### Using the Frontend
1. Add items to cart
2. Go to checkout
3. Enter test phone: `0708374149` (or `254708374149`)
4. Click "Pay with M-Pesa"
5. Check your phone for STK push prompt
6. Enter PIN: `1234`
7. Payment should complete successfully

### Monitor Backend Logs
Watch your backend terminal for:
- ✅ Token generation
- ✅ STK Push request
- ✅ M-Pesa callback
- ✅ Order status update

---

## Step 8: Test Phone Numbers (Sandbox)

| Phone Number | Format 1 | Format 2 |
|-------------|----------|----------|
| Test Number | 0708374149 | 254708374149 |

**PIN**: `1234`

---

## Troubleshooting

### Issue: "Invalid Access Token"
**Solution**: Check your Consumer Key and Consumer Secret are correct

### Issue: "Invalid Shortcode"
**Solution**: Use `174379` for sandbox testing

### Issue: Callback not received
**Solution**: 
- Verify ngrok is running
- Check ngrok URL is correct in `.env`
- Ensure backend server is running
- Try visiting `https://your-ngrok-url.ngrok-free.app/health` in browser

### Issue: "Request failed with code 1"
**Solution**: 
- Check phone number format (must start with 254)
- Verify shortcode and passkey are correct

### Issue: Payment timeout
**Solution**:
- Check internet connection
- Verify M-Pesa sandbox is operational
- Check backend logs for errors

---

## Testing Checklist

- [ ] Daraja account created
- [ ] App created and credentials obtained
- [ ] ngrok running and URL copied
- [ ] `.env` file updated with all M-Pesa credentials
- [ ] Backend server restarted
- [ ] Test payment with phone `254708374149`
- [ ] Payment succeeded and order status updated to "paid"
- [ ] Order appears in customer profile
- [ ] Order appears in admin dashboard

---

## Production Setup

When ready to go live:

1. **Get Production Credentials**:
   - Apply for [Paybill Number](https://www.safaricom.co.ke/paybill)
   - Get production credentials from Daraja portal

2. **Update `.env`**:
   ```env
   MPESA_ENVIRONMENT=production
   MPESA_CONSUMER_KEY=your_production_consumer_key
   MPESA_CONSUMER_SECRET=your_production_consumer_secret
   MPESA_SHORTCODE=your_paybill_number
   MPESA_PASSKEY=your_production_passkey
   MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
   ```

3. **Deploy Backend**:
   - Deploy to a hosting service (Railway, Render, AWS, etc.)
   - Use the production domain for callback URL
   - Ensure HTTPS is enabled

4. **Test thoroughly** with real phone numbers and small amounts

---

## API Endpoints

### Initiate Payment
```
POST /api/payments/mpesa/stk-push
Authorization: Bearer {token}

{
  "order_id": "uuid",
  "phone": "254712345678"
}
```

### Query Payment Status
```
GET /api/payments/mpesa/query/{checkoutRequestId}
Authorization: Bearer {token}
```

### Callback (M-Pesa calls this)
```
POST /api/payments/mpesa/callback
(Called by M-Pesa, no auth required)
```

---

## Security Notes

⚠️ **Never commit your `.env` file to Git!**

✅ Store production credentials securely (use environment variables on your hosting platform)

✅ Always use HTTPS in production

✅ Monitor callback logs for suspicious activity

✅ Validate all M-Pesa callbacks before updating order status

---

## Support Resources

- [Daraja API Documentation](https://developer.safaricom.co.ke/Documentation)
- [M-Pesa STK Push Guide](https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate)
- [Test Credentials](https://developer.safaricom.co.ke/test_credentials)
- [Daraja Support](https://developer.safaricom.co.ke/support)

---

## Payment Flow Diagram

```
Customer → Frontend → Backend → M-Pesa API
                ↓                    ↓
            Order Created     STK Push Sent
                ↓                    ↓
            Waiting...       Customer Enters PIN
                ↓                    ↓
         M-Pesa Callback ← Payment Confirmed
                ↓
         Order Status: PAID
                ↓
      Customer Sees Success
```

---

Happy coding! 🚀💚
