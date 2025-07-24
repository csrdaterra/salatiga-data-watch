-- Drop the old function and recreate with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;