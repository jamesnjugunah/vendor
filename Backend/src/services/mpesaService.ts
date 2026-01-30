import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface MpesaSTKPushPayload {
  phone: string;
  amount: number;
  orderId: string;
  accountReference: string;
}

interface MpesaTokenResponse {
  access_token: string;
  expires_in: string;
}

class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private shortcode: string;
  private passkey: string;
  private callbackUrl: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor() {
    
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || '';
    this.consumerSecret =process.env.MPESA_CONSUMER_SECRET || '';
    this.shortcode = process.env.MPESA_SHORTCODE || '';
    this.passkey = process.env.MPESA_PASSKEY || '';
    this.callbackUrl = process.env.MPESA_CALLBACK_URL || '';
    this.environment = (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || '';
    this.baseUrl = process.env.baseUrl || '';

    // Validate credentials on initialization
    this.validateCredentials();
  }

  private validateCredentials(): void {
    const missing: string[] = [];
    
    if (!this.consumerKey) missing.push('MPESA_CONSUMER_KEY');
    if (!this.consumerSecret) missing.push('MPESA_CONSUMER_SECRET');
    if (!this.shortcode) missing.push('MPESA_SHORTCODE');
    if (!this.passkey) missing.push('MPESA_PASSKEY');
    if (!this.callbackUrl) missing.push('MPESA_CALLBACK_URL');

    if (missing.length > 0) {
      throw new Error(`Missing M-Pesa credentials: ${missing.join(', ')}`);
    }

    console.log('✅ M-Pesa credentials loaded:', {
      consumerKey: `${this.consumerKey.substring(0, 10)}...`,
      consumerSecret: `${this.consumerSecret.substring(0, 10)}...`,
      shortcode: this.shortcode,
      environment: this.environment,
      baseUrl: this.baseUrl
    });
  }

  // Get OAuth token
  private async getAccessToken(): Promise<string> {
    try {
      // Trim any whitespace from credentials
      const cleanKey = this.consumerKey.trim();
      const cleanSecret = this.consumerSecret.trim();
      
      const auth = Buffer.from(`${cleanKey}:${cleanSecret}`).toString('base64');

      console.log('🔑 Requesting M-Pesa access token...');
      console.log('   URL:', `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`);
      console.log('   Auth (first 20 chars):', auth.substring(0, 20) + '...');

      const response = await axios.get<MpesaTokenResponse>(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('✅ Access token obtained successfully');
      console.log('   Token:', response.data.access_token.substring(0, 20) + '...');
      console.log('   Expires in:', response.data.expires_in, 'seconds');

      return response.data.access_token;
    } catch (error: any) {
      console.error('❌ M-Pesa token error:');
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('   Status:', error.response.status);
        console.error('   Status Text:', error.response.statusText);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        console.error('   Headers:', JSON.stringify(error.response.headers, null, 2));
        
        if (error.response.status === 400) {
          throw new Error('Invalid M-Pesa credentials (400 Bad Request). Please check your Consumer Key and Secret.');
        } else if (error.response.status === 401) {
          throw new Error('Unauthorized M-Pesa credentials (401). Your Consumer Key or Secret is incorrect.');
        } else {
          throw new Error(`M-Pesa API error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('   No response received from M-Pesa API');
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);
        throw new Error('No response from M-Pesa API. Check your internet connection.');
      } else {
        // Something happened in setting up the request
        console.error('   Error setting up request:', error.message);
        throw new Error(`Failed to setup M-Pesa request: ${error.message}`);
      }
    }
  }

  // Generate password for STK push
  private generatePassword(): { password: string; timestamp: string } {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Initiate STK Push
  async initiateSTKPush(payload: MpesaSTKPushPayload): Promise<any> {
    try {
      console.log('📱 Initiating STK Push...');
      console.log('   Amount:', payload.amount);
      console.log('   Phone:', payload.phone);
      console.log('   Order ID:', payload.orderId);

      const token = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      // Format phone number (ensure it starts with 254)
      let phone = payload.phone.replace(/\s/g, '');
      if (phone.startsWith('0')) {
        phone = '254' + phone.slice(1);
      } else if (phone.startsWith('+')) {
        phone = phone.slice(1);
      }

      console.log('   Formatted phone:', phone);

      const stkPushPayload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(payload.amount), // M-Pesa requires whole numbers
        PartyA: phone,
        PartyB: this.shortcode,
        PhoneNumber: phone,
        CallBackURL: this.callbackUrl,
        AccountReference: payload.accountReference,
        TransactionDesc: `Payment for Order ${payload.orderId}`,
      };

      console.log('   Payload:', JSON.stringify(stkPushPayload, null, 2));

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        stkPushPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout for STK push
        }
      );

      console.log('✅ STK Push initiated successfully');
      console.log('   Response:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error: any) {
      console.error('❌ STK Push error:');
      
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        throw new Error(`STK Push failed (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('   Error:', error.message);
        throw new Error(`Failed to initiate M-Pesa payment: ${error.message}`);
      }
    }
  }

  // Query transaction status
  async queryTransaction(checkoutRequestId: string): Promise<any> {
    try {
      console.log('🔍 Querying transaction status...');
      console.log('   Checkout Request ID:', checkoutRequestId);

      const token = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const queryPayload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        queryPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      console.log('✅ Query successful');
      console.log('   Response:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error: any) {
      console.error('❌ Query transaction error:');
      
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        throw new Error(`Transaction query failed (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('   Error:', error.message);
        throw new Error(`Failed to query transaction: ${error.message}`);
      }
    }
  }
}

export default new MpesaService();