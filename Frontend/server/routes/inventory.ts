import { Router, Request, Response } from 'express';
import { supabase } from '../config/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Get inventory for a branch
router.get('/:branch', async (req: Request, res: Response) => {
  try {
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products (*)
      `)
      .eq('branch', req.params.branch);

    if (error) throw error;

    res.json({ inventory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Restock branch (admin only)
router.post('/restock', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { from_branch, to_branch, product_id, quantity } = req.body;

    if (!from_branch || !to_branch || !product_id || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    // Get source inventory
    const { data: sourceInventory, error: sourceError } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('branch', from_branch)
      .eq('product_id', product_id)
      .single();

    if (sourceError || !sourceInventory) {
      return res.status(404).json({ error: 'Source inventory not found' });
    }

    if (sourceInventory.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory in source branch' });
    }

    // Decrease source inventory
    const { error: decreaseError } = await supabase
      .from('inventory')
      .update({ quantity: sourceInventory.quantity - quantity })
      .eq('branch', from_branch)
      .eq('product_id', product_id);

    if (decreaseError) throw decreaseError;

    // Get destination inventory
    const { data: destInventory } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('branch', to_branch)
      .eq('product_id', product_id)
      .single();

    if (destInventory) {
      // Update existing inventory
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: destInventory.quantity + quantity })
        .eq('branch', to_branch)
        .eq('product_id', product_id);

      if (updateError) throw updateError;
    } else {
      // Create new inventory record
      const { error: insertError } = await supabase
        .from('inventory')
        .insert({
          branch: to_branch,
          product_id,
          quantity,
        });

      if (insertError) throw insertError;
    }

    res.json({ message: 'Restock successful' });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: 'Failed to restock' });
  }
});

// Update inventory quantity (admin only)
router.put('/:branch/:product_id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { branch, product_id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const { data: inventory, error } = await supabase
      .from('inventory')
      .upsert({
        branch,
        product_id,
        quantity,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ inventory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

export default router;
