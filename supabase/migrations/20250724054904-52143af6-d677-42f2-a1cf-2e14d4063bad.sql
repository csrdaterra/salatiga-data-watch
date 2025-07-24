-- Create price_surveys table for commodity price data collection
CREATE TABLE public.price_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id INTEGER NOT NULL,
  commodity_id INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_status TEXT NOT NULL CHECK (stock_status IN ('available', 'limited', 'unavailable')),
  quality TEXT NOT NULL CHECK (quality IN ('excellent', 'good', 'average', 'poor')),
  notes TEXT,
  survey_date DATE NOT NULL,
  operator_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.price_surveys ENABLE ROW LEVEL SECURITY;

-- Create policies for price surveys
CREATE POLICY "Anyone can view price surveys" 
ON public.price_surveys 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert price surveys" 
ON public.price_surveys 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own surveys" 
ON public.price_surveys 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_price_surveys_updated_at
BEFORE UPDATE ON public.price_surveys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();