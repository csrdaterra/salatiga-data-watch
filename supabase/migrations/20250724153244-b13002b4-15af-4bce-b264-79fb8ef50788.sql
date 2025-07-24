-- Update RLS policy untuk price_surveys agar bisa insert tanpa autentikasi
DROP POLICY IF EXISTS "Authenticated users can insert price surveys" ON public.price_surveys;

-- Create new policy that allows anyone to insert price surveys
CREATE POLICY "Anyone can insert price surveys" 
ON public.price_surveys 
FOR INSERT 
WITH CHECK (true);