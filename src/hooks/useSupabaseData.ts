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
      // Fetch order - use .maybeSingle() to avoid errors when no order is found
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .eq('customer_phone', phone)
        .maybeSingle();

      if (orderError) throw orderError;
      
      if (!orderData) {
        throw new Error('Order not found. Please check your Order ID and phone number.');
      }
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
    
    if (!orderData.delivery_address || orderData.delivery_address.trim().length < 5) {
      throw new Error('Delivery address must be at least 5 characters long');
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

    // Send email notifications
    try {
      // Send admin notification
      await supabase.functions.invoke('send-order-email', {
        body: {
          orderId: order.order_id,
          orderData: {
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            customer_email: order.customer_email,
            delivery_address: order.delivery_address,
            county: order.county,
            town: order.town,
            total_amount: order.total_amount,
            items: orderData.items.map(item => ({
              product_name: 'Product', // You might want to fetch product names here
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.total_price
            }))
          }
        }
      });

      // Send customer confirmation email if email provided
      if (order.customer_email) {
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: order.order_id,
            customerEmail: order.customer_email,
            customerName: order.customer_name,
            items: orderData.items.map(item => ({
              name: 'Product', // You might want to fetch product names here
              quantity: item.quantity,
              price: item.unit_price
            })),
            total: order.total_amount,
            deliveryAddress: `${order.delivery_address}, ${order.town}, ${order.county}`
          }
        });
      }
    } catch (emailError) {
      console.warn('Failed to send email notifications:', emailError);
      // Don't fail the order creation if email fails
    }

    return { success: true, order };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

// Hook for accessing Supabase data in components
export function useSupabaseData() {
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    const formattedProducts = data?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      image: product.images?.[0] || '',
      condition: product.condition as 'new' | 'used',
      stock: product.stock_quantity,
      category: product.categories?.name || 'Uncategorized'
    })) || [];
    
    setProducts(formattedProducts);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
  };

  const refetchProducts = () => fetchProducts();
  const refetchOrders = () => fetchOrders();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    products,
    categories,
    orders,
    loading,
    refetchProducts,
    refetchOrders
  };
}