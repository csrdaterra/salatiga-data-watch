-- Create stock_bapokting table for monthly stock achievement data
CREATE TABLE public.stock_bapokting (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_date DATE NOT NULL,
  commodity_id INTEGER NOT NULL,
  store_name TEXT NOT NULL,
  january_capaian INTEGER DEFAULT 0,
  february INTEGER DEFAULT 0,
  march INTEGER DEFAULT 0,
  april INTEGER DEFAULT 0,
  may INTEGER DEFAULT 0,
  june INTEGER DEFAULT 0,
  july INTEGER DEFAULT 0,
  august INTEGER DEFAULT 0,
  september INTEGER DEFAULT 0,
  october INTEGER DEFAULT 0,
  november INTEGER DEFAULT 0,
  december INTEGER DEFAULT 0,
  operator_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stock_bapokting ENABLE ROW LEVEL SECURITY;

-- Create policies for stock_bapokting
CREATE POLICY "Users can view all stock bapokting data"
ON public.stock_bapokting
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert stock bapokting data"
ON public.stock_bapokting
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own stock data"
ON public.stock_bapokting
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all stock data"
ON public.stock_bapokting
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stock_bapokting_updated_at
BEFORE UPDATE ON public.stock_bapokting
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_stock_bapokting_commodity_id ON public.stock_bapokting(commodity_id);
CREATE INDEX idx_stock_bapokting_survey_date ON public.stock_bapokting(survey_date);
CREATE INDEX idx_stock_bapokting_user_id ON public.stock_bapokting(user_id);