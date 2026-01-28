import { Router } from 'express';
import { supabase } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import mpesaService from '../services/mpesaService';

const router = Router();

// Initiate M-Pesa payment
router.post('/mpesa/stk-push', authenticate, async (req: AuthRequest, res) => {
  try {
    const { order_id, phone } = req.body;

    if (!order_id || !phone) {
      return res.status(400).json({ error: 'Order ID and phone number are required' });
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', req.user!.id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending payment' });
    }

    // Initiate STK push
    const mpesaResponse = await mpesaService.initiateSTKPush({
      phone,
      amount: order.total,
      orderId: order.id,
      accountReference: `ORDER-${order.id.slice(0, 8)}`,
    });

    // Store checkout request ID for callback verification
    await supabase
      .from('orders')
      .update({
        mpesa_checkout_request_id: mpesaResponse.CheckoutRequestID,
        status: 'processing',
      })
      .eq('id', order_id);

    res.json({
      message: 'Payment initiated. Please check your phone.',
      checkoutRequestId: mpesaResponse.CheckoutRequestID,
      merchantRequestId: mpesaResponse.MerchantRequestID,
    });
  } catch (error: any) {
    console.error('STK Push error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
});

// M-Pesa callback
router.post('/mpesa/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const { stkCallback } = Body;

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Find order by checkout request ID
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('mpesa_checkout_request_id', CheckoutRequestID)
      .single();

    if (!order) {
      console.error('Order not found for CheckoutRequestID:', CheckoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // Update order based on result
    if (ResultCode === 0) {
      // Payment successful
      let mpesaReceiptNumber = '';
      
      if (CallbackMetadata?.Item) {
        const receiptItem = CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber');
        mpesaReceiptNumber = receiptItem?.Value || '';
      }

      await supabase
        .from('orders')
        .update({
          status: 'paid',
          mpesa_code: mpesaReceiptNumber,
        })
        .eq('id', order.id);

      console.log(`Order ${order.id} paid successfully. Receipt: ${mpesaReceiptNumber}`);
    } else {
      // Payment failed
      await supabase
        .from('orders')
        .update({
          status: 'failed',
        })
        .eq('id', order.id);

      console.log(`Order ${order.id} payment failed: ${ResultDesc}`);
    }

    // Respond to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

// Query transaction status
router.get('/mpesa/query/:checkoutRequestId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const result = await mpesaService.queryTransaction(checkoutRequestId);

    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to query transaction' });
  }
});

export default router;
