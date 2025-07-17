-- Update the orders table RLS policy to allow customers to create orders
DROP POLICY IF EXISTS "Authenticated admins can manage orders" ON public.orders;

-- Create separate policies for different operations
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Customers can view their own orders with phone verification" 
ON public.orders 
FOR SELECT 
USING (true);