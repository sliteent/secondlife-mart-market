-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own orders with phone verification" ON public.orders;

-- Create new policies to allow customers to create orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete orders" 
ON public.orders 
FOR DELETE 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Anyone can view orders" 
ON public.orders 
FOR SELECT 
USING (true);