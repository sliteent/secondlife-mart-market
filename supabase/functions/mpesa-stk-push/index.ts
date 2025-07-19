import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

// Input validation functions
const sanitizeString = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '').trim();
};

const validatePhoneNumber = (phone: string): boolean => {
  const kenyanPhoneRegex = /^(254|0)[7][0-9]{8}$|^(254|0)[1][0-9]{8}$/;
  return kenyanPhoneRegex.test(phone.replace(/\s+/g, ''));
};

const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000;
};

const validateOrderId = (orderId: string): boolean => {
  return /^[A-Z0-9_-]+$/i.test(orderId) && orderId.length <= 50;
};

// Data interfaces
interface STKPushRequest {
  orderId: string;
  phone: string;
  amount: number;
}

interface STKCallbackRequest {
  orderId: string;
  transactionCode: string;
  status: 'success' | 'failed';
  resultDesc?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    console.log(`M-Pesa STK Push request: ${action}`);

    switch (action) {
      case "initiate": {
        // Handle STK push initiation
        const { orderId, phone, amount }: STKPushRequest = await req.json();

        // Validate inputs
        if (!orderId || !validateOrderId(orderId)) {
          throw new Error("Invalid order ID");
        }

        if (!phone || !validatePhoneNumber(phone)) {
          throw new Error("Invalid phone number");
        }

        if (!amount || !validateAmount(amount)) {
          throw new Error("Invalid amount");
        }

        // Sanitize inputs
        const sanitizedOrderId = sanitizeString(orderId);
        const sanitizedPhone = sanitizeString(phone);

        console.log(`Initiating STK push for order ${sanitizedOrderId}, phone ${sanitizedPhone}, amount ${amount}`);

        // Simulate STK push API call (in production, you would call Safaricom's API)
        const stkPushData = {
          MerchantRequestID: `MR${Date.now()}`,
          CheckoutRequestID: `CR${Date.now()}`,
          ResponseCode: "0",
          ResponseDescription: "Success. Request accepted for processing",
          CustomerMessage: `You will receive a prompt on ${sanitizedPhone} to complete the payment of KSh ${amount}. Please enter your M-Pesa PIN.`
        };

        // Store the STK push request in database for tracking
        const { error: insertError } = await supabase
          .from('orders')
          .update({
            mpesa_checkout_request_id: stkPushData.CheckoutRequestID,
            status: 'pending'
          })
          .eq('order_id', sanitizedOrderId);

        if (insertError) {
          console.error('Error updating order:', insertError);
          throw new Error('Failed to update order status');
        }

        console.log(`STK push initiated successfully for order ${sanitizedOrderId}`);

        return new Response(JSON.stringify({
          success: true,
          data: stkPushData
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      case "callback": {
        // Handle M-Pesa callback
        const { orderId, transactionCode, status, resultDesc }: STKCallbackRequest = await req.json();

        // Validate inputs
        if (!orderId || !validateOrderId(orderId)) {
          throw new Error("Invalid order ID");
        }

        const sanitizedOrderId = sanitizeString(orderId);
        const sanitizedTransactionCode = transactionCode ? sanitizeString(transactionCode) : null;

        console.log(`Processing M-Pesa callback for order ${sanitizedOrderId}, status: ${status}`);

        // Update order status based on callback
        const updateData: any = {
          updated_at: new Date().toISOString()
        };

        if (status === 'success') {
          updateData.status = 'confirmed';
          updateData.mpesa_transaction_code = sanitizedTransactionCode;
          updateData.estimated_delivery_date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 3 days from now
        } else {
          updateData.status = 'cancelled';
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('order_id', sanitizedOrderId);

        if (updateError) {
          console.error('Error updating order after callback:', updateError);
          throw new Error('Failed to update order status');
        }

        console.log(`Order ${sanitizedOrderId} updated successfully after callback`);

        return new Response(JSON.stringify({
          success: true,
          message: "Callback processed successfully"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      case "verify": {
        // Handle manual transaction verification
        const { orderId, transactionCode }: { orderId: string; transactionCode: string } = await req.json();

        // Validate inputs
        if (!orderId || !validateOrderId(orderId)) {
          throw new Error("Invalid order ID");
        }

        if (!transactionCode || transactionCode.length < 8) {
          throw new Error("Invalid transaction code");
        }

        const sanitizedOrderId = sanitizeString(orderId);
        const sanitizedTransactionCode = sanitizeString(transactionCode);

        console.log(`Verifying manual transaction for order ${sanitizedOrderId}, code: ${sanitizedTransactionCode}`);

        // In production, you would verify the transaction with Safaricom API
        // For now, we'll accept any transaction code that looks valid
        const isValidTransaction = /^[A-Z0-9]{8,12}$/i.test(sanitizedTransactionCode);

        if (!isValidTransaction) {
          throw new Error("Invalid transaction code format");
        }

        // Update order with manual verification
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            mpesa_transaction_code: sanitizedTransactionCode,
            estimated_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('order_id', sanitizedOrderId);

        if (updateError) {
          console.error('Error updating order after verification:', updateError);
          throw new Error('Failed to update order status');
        }

        console.log(`Order ${sanitizedOrderId} verified and confirmed successfully`);

        return new Response(JSON.stringify({
          success: true,
          message: "Transaction verified successfully"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid action"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
    }
  } catch (error: any) {
    console.error("Error in M-Pesa STK Push function:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
};

serve(handler);