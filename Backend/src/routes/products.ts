import { Router } from 'express';
import { supabase } from '../config/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: products, error } = await query.order('name');

    if (error) throw error;

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/new', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, category, price, image, description, ingredients, nutritional_info, volume, brand } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Name, category, and price are required' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        category,
        price,
        image,
        description,
        ingredients,
        nutritional_info,
        volume,
        brand,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, category, price, image, description, ingredients, nutritional_info, volume, brand } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (price !== undefined) updates.price = price;
    if (image) updates.image = image;
    if (description) updates.description = description;
    if (ingredients) updates.ingredients = ingredients;
    if (nutritional_info) updates.nutritional_info = nutritional_info;
    if (volume) updates.volume = volume;
    if (brand) updates.brand = brand;

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
