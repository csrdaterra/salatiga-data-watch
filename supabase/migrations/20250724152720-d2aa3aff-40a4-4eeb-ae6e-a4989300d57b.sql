-- Create markets table for Salatiga
CREATE TABLE public.markets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT,
  city TEXT NOT NULL DEFAULT 'Salatiga',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;

-- Create policies for markets
CREATE POLICY "Markets are viewable by everyone" 
ON public.markets 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert markets" 
ON public.markets 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update markets" 
ON public.markets 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_markets_updated_at
BEFORE UPDATE ON public.markets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Salatiga markets data
INSERT INTO public.markets (name, address, contact, city) VALUES
('Pasar Raya Salatiga', 'Jl. Jend. Sudirman No. 1, Salatiga', '0298-321001', 'Salatiga'),
('Pasar Pagi Blotongan', 'Jl. Blotongan, Salatiga', '0298-321002', 'Salatiga'),
('Pasar Kapling', 'Jl. Kapling Raya, Salatiga', '0298-321003', 'Salatiga'),
('Pasar Tingkir', 'Jl. Tingkir, Salatiga', '0298-321004', 'Salatiga'),
('Pasar Ledok', 'Jl. Ledok, Salatiga', '0298-321005', 'Salatiga');