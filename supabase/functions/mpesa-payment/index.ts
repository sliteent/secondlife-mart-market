import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Input validation functions
const sanitizeString = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '').trim();
};

const validatePhoneNumber = (phone: string): boolean => {
  const kenyanPhoneRegex = /^(254|0)[7][0-9]{8}$|^(254|0)[1][0-9]{8}$/;
  return kenyanPhoneRegex.test(phone.replace(/\s+/g, ''));
};

const validateMpesaCode = (code: string): boolean => {
  const mpesaCodeRegex = /^[A-Z0-9]{10}$/;
  return mpesaCodeRegex.test(code.toUpperCase());
};

const validateOrderId = (orderId: string): boolean => {
  return /^SLM[0-9]{6}$/.test(orderId);
};

interface PaymentRequest {
  orderId: string;
  phone: string;
  amount: number;
}

interface PaymentCallbackRequest {
  orderId: string;
  transactionCode: string;
  status: 'success' | 'failed';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'initiate') {
      // STK Push initiation
      const { orderId, phone, amount }: PaymentRequest = await req.json();
      
      // Input validation
      if (!validateOrderId(orderId)) {
        return new Response(JSON.stringify({ error: 'Invalid order ID format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      if (!validatePhoneNumber(phone)) {
        return new Response(JSON.stringify({ error: 'Invalid phone number format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      if (!amount || amount <= 0 || amount > 1000000) {
        return new Response(JSON.stringify({ error: 'Invalid amount' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      // For STK push, we'll create a temporary order if it doesn't exist
      // In a real implementation, you'd first create the order, then initiate payment
      
      console.log(`Initiating STK Push for phone ${phone}, amount ${amount}`);
      
      // For demonstration - in production, you'd integrate with Daraja API
      // This simulates the STK Push process
      const response = {
        success: true,
        message: 'STK Push sent successfully',
        checkoutRequestId: `ws_CO_${Date.now()}`,
        instructions: `
          1. Check your phone for M-Pesa prompt
          2. Enter your M-Pesa PIN to complete payment
          3. You will receive an SMS confirmation
          4. Your order will be automatically confirmed
        `
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (action === 'callback') {
      // M-Pesa payment callback/confirmation
      const { orderId, transactionCode, status }: PaymentCallbackRequest = await req.json();
      
      // Input validation
      if (!validateOrderId(orderId)) {
        return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      if (!validateMpesaCode(transactionCode)) {
        return new Response(JSON.stringify({ error: 'Invalid transaction code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      console.log(`Processing payment callback for order ${orderId}, transaction ${transactionCode}, status ${status}`);
      
      // Update order with transaction code and status
      const { error } = await supabase
        .from('orders')
        .update({
          mpesa_transaction_code: sanitizeString(transactionCode.toUpperCase()),
          status: status === 'success' ? 'confirmed' : 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        return new Response(JSON.stringify({ error: 'Failed to update order' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: status === 'success' ? 'Payment confirmed successfully' : 'Payment failed'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (action === 'verify') {
      // Verify transaction manually
      const { orderId, transactionCode } = await req.json();
      
      // Input validation
      if (!validateOrderId(orderId)) {
        return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      if (!validateMpesaCode(transactionCode)) {
        return new Response(JSON.stringify({ error: 'Invalid transaction code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      console.log(`Verifying transaction ${transactionCode} for order ${orderId}`);
      
      // In production, you'd verify with Safaricom API
      // For now, we'll just update the order
      const { error } = await supabase
        .from('orders')
        .update({
          mpesa_transaction_code: sanitizeString(transactionCode.toUpperCase()),
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (error) {
        console.error('Error verifying transaction:', error);
        return new Response(JSON.stringify({ error: 'Failed to verify transaction' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Transaction verified and order confirmed'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in mpesa-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);