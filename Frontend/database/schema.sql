-- FreshMart Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('sodas', 'energy', 'juice', 'water')),
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  ingredients TEXT,
  nutritional_info JSONB,
  volume VARCHAR(50),
  brand VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category
CREATE INDEX idx_products_category ON products(category);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch VARCHAR(50) NOT NULL CHECK (branch IN ('nairobi', 'kisumu', 'mombasa', 'nakuru', 'eldoret')),
  delivery_address TEXT,
  delivery_location JSONB,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'processing', 'completed', 'cancelled')),
  mpesa_code VARCHAR(50),
  mpesa_checkout_request_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_id
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Inventory table
CREATE TABLE inventory (
  branch VARCHAR(50) NOT NULL CHECK (branch IN ('nairobi', 'kisumu', 'mombasa', 'nakuru', 'eldoret')),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (branch, product_id)
);

-- Create trigger to update updated_at on inventory
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, category, price, image, description, ingredients, nutritional_info, volume, brand) VALUES
('Coca-Cola', 'sodas', 50, '/images/coke.jpg', 'The iconic Coca-Cola taste - a refreshing cola drink that has been bringing people together for over 130 years.', 
 'Carbonated water, sugar, color (caramel E150d), phosphoric acid, natural flavors including caffeine', 
 '{"servingSize": "330ml", "calories": 139, "sugar": "35g", "sodium": "15mg"}', '330ml', 'The Coca-Cola Company'),
 
('Fanta Orange', 'sodas', 50, '/images/fanta.jpg', 'Bright, bubbly, and instantly refreshing. Fanta Orange is made with 100% natural flavors.', 
 'Carbonated water, sugar, orange fruit from concentrate (5%), citric acid, natural orange flavoring', 
 '{"servingSize": "330ml", "calories": 144, "sugar": "36g", "sodium": "12mg"}', '330ml', 'The Coca-Cola Company'),
 
('Sprite', 'sodas', 50, '/images/sprite.jpg', 'Obey Your Thirst! Sprite is a perfectly clear lemon-lime sparkling drink.', 
 'Carbonated water, sugar, citric acid, natural lemon and lime flavoring', 
 '{"servingSize": "330ml", "calories": 140, "sugar": "35g", "sodium": "33mg"}', '330ml', 'The Coca-Cola Company'),
 
('Pepsi', 'sodas', 50, '/images/pepsi.jpg', 'Bold cola taste with a perfect balance of sweet and refreshing.', 
 'Carbonated water, sugar, color (caramel E150d), acid (phosphoric acid), flavorings (including caffeine)', 
 '{"servingSize": "330ml", "calories": 150, "sugar": "36g", "sodium": "18mg"}', '330ml', 'PepsiCo'),
 
('Monster Energy', 'energy', 150, '/images/monster.jpg', 'Unleash The Beast! Monster Energy packs a powerful punch of energy.', 
 'Carbonated water, sucrose, glucose, citric acid, taurine, caffeine, natural flavors', 
 '{"servingSize": "500ml", "calories": 240, "sugar": "54g", "sodium": "370mg"}', '500ml', 'Monster Beverage Corporation'),
 
('Red Bull', 'energy', 200, '/images/redbull.jpg', 'Red Bull Energy Drink gives you wings!', 
 'Carbonated water, sucrose, glucose, citric acid, taurine, caffeine, vitamins', 
 '{"servingSize": "250ml", "calories": 110, "sugar": "27g", "sodium": "105mg"}', '250ml', 'Red Bull GmbH'),
 
('Minute Maid Orange', 'juice', 80, '/images/orange-juice.jpg', 'Fresh-squeezed taste with no added sugar. Made from 100% pure orange juice.', 
 'Orange juice from concentrate, water, natural flavors, vitamin C', 
 '{"servingSize": "300ml", "calories": 120, "sugar": "22g", "sodium": "5mg"}', '300ml', 'The Coca-Cola Company'),
 
('Apple Juice', 'juice', 80, '/images/apple-juice.jpg', '100% pure apple juice made from fresh handpicked apples.', 
 'Apple juice from concentrate, water, vitamin C', 
 '{"servingSize": "300ml", "calories": 130, "sugar": "24g", "sodium": "10mg"}', '300ml', 'Fresh Harvest'),
 
('Fresh Lemonade', 'juice', 70, '/images/lemonade.jpg', 'Refreshingly tangy and sweet homemade-style lemonade.', 
 'Water, lemon juice from concentrate (10%), sugar, natural lemon flavoring', 
 '{"servingSize": "330ml", "calories": 100, "sugar": "25g", "sodium": "20mg"}', '330ml', 'Tropical Fresh'),
 
('Iced Tea', 'juice', 60, '/images/iced-tea.jpg', 'Smooth, refreshing iced tea with a hint of lemon.', 
 'Water, sugar, black tea extract, citric acid, natural lemon flavor', 
 '{"servingSize": "330ml", "calories": 80, "sugar": "20g", "sodium": "25mg"}', '330ml', 'Lipton'),
 
('Mineral Water', 'water', 30, '/images/water.jpg', 'Pure, crisp natural mineral water sourced from protected underground springs.', 
 'Natural mineral water with naturally occurring minerals', 
 '{"servingSize": "500ml", "calories": 0, "sugar": "0g", "sodium": "5mg"}', '500ml', 'Keringet'),
 
('Gatorade', 'water', 120, '/images/gatorade.jpg', 'Scientifically formulated sports drink that helps you rehydrate, replenish and refuel.', 
 'Water, sucrose, dextrose, citric acid, natural flavor, salt, electrolytes', 
 '{"servingSize": "500ml", "calories": 140, "sugar": "34g", "sodium": "275mg"}', '500ml', 'PepsiCo');

-- Initialize inventory for all branches
INSERT INTO inventory (branch, product_id, quantity)
SELECT 
  branch,
  p.id,
  CASE 
    WHEN branch = 'nairobi' THEN 1000
    ELSE 100
  END
FROM 
  products p
CROSS JOIN (
  SELECT unnest(ARRAY['nairobi', 'kisumu', 'mombasa', 'nakuru', 'eldoret']) AS branch
) branches;

-- Create admin user (password: admin123)
-- Note: This is a bcrypt hash of 'admin123'
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Admin', 'admin@freshmart.co.ke', '+254700000000', '$2b$10$rYJkNZjXhh7L6hqO8yKzWOJ8uL6FZZ1kZVYJqYJqYJqYJqYJqYJqY', 'admin');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by admins"
  ON products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Products are updatable by admins"
  ON products FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Products are deletable by admins"
  ON products FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for orders (users see own, admins see all)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  ));

-- RLS Policies for inventory (public read, admin write)
CREATE POLICY "Inventory is viewable by everyone"
  ON inventory FOR SELECT
  USING (true);

CREATE POLICY "Inventory is manageable by admins"
  ON inventory FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for users (users see own profile, admins see all)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
