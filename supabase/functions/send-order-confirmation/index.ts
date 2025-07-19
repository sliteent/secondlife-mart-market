import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail?: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryAddress: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, customerName, items, total, deliveryAddress }: OrderConfirmationRequest = await req.json();

    console.log(`Sending order confirmation for ${orderId} to ${customerEmail}`);

    if (!customerEmail) {
      console.log("No email provided, skipping email notification");
      return new Response(JSON.stringify({ success: true, message: "No email provided" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const itemsList = items.map(item => 
      `<li>${item.name} - Qty: ${item.quantity} - KSh ${item.price.toLocaleString()}</li>`
    ).join('');

    const emailResponse = await resend.emails.send({
      from: "SLmarkets <orders@resend.dev>",
      to: [customerEmail],
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Confirmation</h1>
          <p>Dear ${customerName},</p>
          <p>Thank you for your order! We have received your order and it is being processed.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Order Details</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Amount:</strong> KSh ${total.toLocaleString()}</p>
            <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
            
            <h3 style="color: #333;">Items Ordered:</h3>
            <ul style="list-style: none; padding: 0;">
              ${itemsList}
            </ul>
          </div>
          
          <p>We will notify you once your order has been shipped with tracking information.</p>
          <p>If you have any questions about your order, please contact our customer support.</p>
          
          <p>Thank you for shopping with SLmarkets!</p>
          <p>Best regards,<br>The SLmarkets Team</p>
        </div>
      `,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);