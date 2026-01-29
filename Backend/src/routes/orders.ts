import { Router, Response } from 'express';
import { supabase } from '../config/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Create order
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { branch, delivery_address, delivery_location, items } = req.body;

    if (!branch || !items || items.length === 0) {
      return res.status(400).json({ error: 'Branch and items are required' });
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user!.id,
        branch,
        delivery_address,
        delivery_location,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json({ order });
  } catch (error: any) {
  console.error('Create order error:', error);
  res.status(500).json({
    error: 'Failed to create order',
    details: error?.message || error
  });
}

});

// Get user's orders
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        users (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (order.user_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, branch } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        users (
          id,
          name,
          email,
          phone
        )
      `);

    if (status) {
      query = query.eq('status', status);
    }

    if (branch) {
      query = query.eq('branch', branch);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!['pending', 'paid', 'failed', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get order to check permissions
    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only admin or order owner can update (owner can only cancel)
    if (req.user!.role !== 'admin' && (order.user_id !== req.user!.id || status !== 'cancelled')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
