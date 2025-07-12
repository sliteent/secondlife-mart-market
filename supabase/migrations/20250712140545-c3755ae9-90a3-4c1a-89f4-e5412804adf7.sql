-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used')),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  images TEXT[], -- Array of image URLs
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE, -- User-facing order ID
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  county TEXT NOT NULL,
  town TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 200,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'mpesa',
  mpesa_transaction_code TEXT,
  estimated_delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for optional user accounts
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  address TEXT,
  county TEXT,
  town TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (ecommerce site)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Orders are viewable by customer" 
ON public.orders FOR SELECT USING (true); -- We'll use order_id + phone for verification

CREATE POLICY "Order items are viewable with order" 
ON public.order_items FOR SELECT USING (true);

-- Admin policies (will be restricted to authenticated admin users later)
CREATE POLICY "Admin can manage categories" 
ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin can manage products" 
ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin can manage orders" 
ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "System can create order items" 
ON public.order_items FOR INSERT WITH CHECK (true);

-- Profile policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admin can upload product images" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admin can update product images" 
ON storage.objects FOR UPDATE USING (bucket_id = 'products');

CREATE POLICY "Admin can delete product images" 
ON storage.objects FOR DELETE USING (bucket_id = 'products');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate user-friendly order IDs
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'SLM' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order_id
CREATE OR REPLACE FUNCTION public.set_order_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_id IS NULL THEN
    NEW.order_id := public.generate_order_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_id_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_id();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Electronics', 'Phones, computers, gadgets and electronic devices'),
('Clothing', 'Men and women clothing, shoes and accessories'),
('Home Appliances', 'Kitchen appliances, furniture and home equipment'),
('Books', 'Educational books, novels and magazines'),
('Sports', 'Sports equipment, fitness gear and outdoor items'),
('Beauty', 'Cosmetics, skincare and beauty products');

-- Insert sample products
INSERT INTO public.products (name, description, price, condition, category_id, stock_quantity, images) VALUES
('iPhone 13 Pro', 'Latest iPhone with excellent camera quality', 85000.00, 'used', (SELECT id FROM public.categories WHERE name = 'Electronics'), 5, ARRAY['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500']),
('Samsung Galaxy S21', 'Flagship Android phone in great condition', 65000.00, 'used', (SELECT id FROM public.categories WHERE name = 'Electronics'), 3, ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500']),
('MacBook Pro M1', 'Powerful laptop for professionals', 120000.00, 'used', (SELECT id FROM public.categories WHERE name = 'Electronics'), 2, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500']),
('Nike Air Force 1', 'Classic white sneakers', 8500.00, 'new', (SELECT id FROM public.categories WHERE name = 'Clothing'), 10, ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500']),
('Microwave Oven', 'Digital microwave with multiple settings', 15000.00, 'new', (SELECT id FROM public.categories WHERE name = 'Home Appliances'), 8, ARRAY['https://images.unsplash.com/photo-1574269909862-7e1d70bb8c3f?w=500']),
('Programming Book Set', 'Complete set of coding books', 3500.00, 'used', (SELECT id FROM public.categories WHERE name = 'Books'), 15, ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500']);