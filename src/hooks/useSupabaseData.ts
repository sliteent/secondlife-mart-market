import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: 'new' | 'used';
  category_id: string;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// For the old product card compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  condition: 'new' | 'used';
  category: string;
  image: string;
  stock: number;
  description?: string;
}

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  county: string;
  town: string;
  total_amount: number;
  delivery_fee: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  mpesa_transaction_code?: string;
  estimated_delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: Product;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useProducts = (categoryFilter?: string, conditionFilter?: string, searchTerm?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('category_id', categoryFilter);
        }

        if (conditionFilter && conditionFilter !== 'all') {
          query = query.eq('condition', conditionFilter);
        }

        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts((data || []) as Product[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, conditionFilter, searchTerm]);

  return { products, loading, error };
};

export const useOrderTracking = (orderId: string, phone: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = async () => {
    if (!orderId || !phone) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .eq('customer_phone', phone)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData as Order);

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('order_id', orderData.id);

      if (itemsError) throw itemsError;
      setOrderItems((itemsData || []) as OrderItem[]);

    } catch (err: any) {
      setError(err.message);
      setOrder(null);
      setOrderItems([]);
    } finally {
      setLoading(false);
    }
  };

  return { order, orderItems, loading, error, trackOrder };
};

// Input validation functions
const sanitizeString = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '').trim();
};

const validatePhoneNumber = (phone: string): boolean => {
  const kenyanPhoneRegex = /^(254|0)[7][0-9]{8}$|^(254|0)[1][0-9]{8}$/;
  return kenyanPhoneRegex.test(phone.replace(/\s+/g, ''));
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createOrder = async (orderData: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  county: string;
  town: string;
  total_amount: number;
  delivery_fee: number;
  items: { product_id: string; quantity: number; unit_price: number; total_price: number }[];
}) => {
  try {
    // Input validation
    if (!orderData.customer_name || orderData.customer_name.trim().length < 2) {
      throw new Error('Customer name must be at least 2 characters long');
    }
    
    if (!validatePhoneNumber(orderData.customer_phone)) {
      throw new Error('Invalid phone number format. Please use a valid Kenyan phone number');
    }
    
    if (orderData.customer_email && !validateEmail(orderData.customer_email)) {
      throw new Error('Invalid email format');
    }
    
    if (!orderData.delivery_address || orderData.delivery_address.trim().length < 10) {
      throw new Error('Delivery address must be at least 10 characters long');
    }
    
    if (!orderData.county || !orderData.town) {
      throw new Error('County and town are required');
    }
    
    if (orderData.total_amount <= 0 || orderData.total_amount > 1000000) {
      throw new Error('Invalid order amount');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Sanitize inputs
    const sanitizedOrderData = {
      customer_name: sanitizeString(orderData.customer_name),
      customer_phone: sanitizeString(orderData.customer_phone),
      customer_email: orderData.customer_email ? sanitizeString(orderData.customer_email) : undefined,
      delivery_address: sanitizeString(orderData.delivery_address),
      county: sanitizeString(orderData.county),
      town: sanitizeString(orderData.town),
      total_amount: orderData.total_amount,
      delivery_fee: orderData.delivery_fee,
    };

    // Create order (order_id will be auto-generated by trigger)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(sanitizedOrderData as any)
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, order };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};