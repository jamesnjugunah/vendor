import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client with service role (bypass RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types for database tables
export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface DbProduct {
  id: string;
  name: string;
  category: 'sodas' | 'energy' | 'juice' | 'water';
  price: number;
  image: string;
  description?: string;
  ingredients?: string;
  nutritional_info?: any;
  volume?: string;
  brand?: string;
  created_at: string;
}

export interface DbOrder {
  id: string;
  user_id: string;
  branch: string;
  delivery_address?: string;
  delivery_location?: any;
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'processing' | 'completed' | 'cancelled';
  mpesa_code?: string;
  created_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface DbInventory {
  branch: string;
  product_id: string;
  quantity: number;
  updated_at: string;
}
