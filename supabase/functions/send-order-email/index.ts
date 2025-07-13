import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OrderEmailRequest {
  orderId: string;
  orderData: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    delivery_address: string;
    county: string;
    town: string;
    total_amount: number;
    items: Array<{
      product_name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, orderData }: OrderEmailRequest = await req.json();
    
    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "SLM Store <orders@resend.dev>",
      to: ["admin@slmstore.com"], // Replace with actual admin email
      subject: `New Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Order Received</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Customer:</strong> ${orderData.customer_name}</p>
            <p><strong>Phone:</strong> ${orderData.customer_phone}</p>
            ${orderData.customer_email ? `<p><strong>Email:</strong> ${orderData.customer_email}</p>` : ''}
            <p><strong>Total Amount:</strong> KSh ${orderData.total_amount.toLocaleString()}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Delivery Address</h3>
            <p>${orderData.delivery_address}</p>
            <p>${orderData.town}, ${orderData.county}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #ddd;">
                  <th style="text-align: left; padding: 10px;">Product</th>
                  <th style="text-align: center; padding: 10px;">Qty</th>
                  <th style="text-align: right; padding: 10px;">Price</th>
                  <th style="text-align: right; padding: 10px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items.map(item => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${item.product_name}</td>
                    <td style="text-align: center; padding: 10px;">${item.quantity}</td>
                    <td style="text-align: right; padding: 10px;">KSh ${item.unit_price.toLocaleString()}</td>
                    <td style="text-align: right; padding: 10px;">KSh ${item.total_price.toLocaleString()}</td>
                  </tr>
                `).join('')}
                <tr style="border-top: 2px solid #ddd; font-weight: bold;">
                  <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
                  <td style="text-align: right; padding: 10px;">KSh ${orderData.total_amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Please process this order and update the status in the admin panel.
          </p>
        </div>
      `,
    });

    console.log("Order email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: "Order email sent to admin"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);