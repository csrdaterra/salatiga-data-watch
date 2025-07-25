-- Create SPBU LPG table
CREATE TABLE public.spbu_lpg (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha TEXT NOT NULL,
  nomor_spbu TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT,
  penanggungjawab TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AGEN LPG table
CREATE TABLE public.agen_lpg (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha TEXT NOT NULL,
  nomor_spbu TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT,
  penanggungjawab TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PANGKALAN LPG table
CREATE TABLE public.pangkalan_lpg (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha TEXT NOT NULL,
  nomor_spbu TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT,
  penanggungjawab TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SPBE table
CREATE TABLE public.spbe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha TEXT NOT NULL,
  nomor_spbu TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT,
  penanggungjawab TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create JENIS BBM table
CREATE TABLE public.jenis_bbm (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_jenis TEXT NOT NULL,
  keterangan TEXT,
  satuan TEXT NOT NULL DEFAULT 'Liter',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create DATA AGEN REALISASI GAS 3 KG table
CREATE TABLE public.agen_realisasi_gas_3kg (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha TEXT NOT NULL,
  nomor_spbu TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT,
  penanggungjawab TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  realisasi_bulanan INTEGER DEFAULT 0,
  target_bulanan INTEGER DEFAULT 0,
  periode_bulan INTEGER NOT NULL,
  periode_tahun INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create DATA AGEN REALISASI BBM table
CREATE TABLE public.agen_realisasi_bbm (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_usaha TEXT NOT NULL,
  nomor_spbu TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT,
  penanggungjawab TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  jenis_bbm_id UUID REFERENCES public.jenis_bbm(id),
  realisasi_bulanan DECIMAL(15, 2) DEFAULT 0,
  target_bulanan DECIMAL(15, 2) DEFAULT 0,
  periode_bulan INTEGER NOT NULL,
  periode_tahun INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.spbu_lpg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agen_lpg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pangkalan_lpg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spbe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jenis_bbm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agen_realisasi_gas_3kg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agen_realisasi_bbm ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for SPBU LPG
CREATE POLICY "Users can view all spbu lpg data" ON public.spbu_lpg FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert spbu lpg data" ON public.spbu_lpg FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update spbu lpg data" ON public.spbu_lpg FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete spbu lpg data" ON public.spbu_lpg FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for AGEN LPG
CREATE POLICY "Users can view all agen lpg data" ON public.agen_lpg FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert agen lpg data" ON public.agen_lpg FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update agen lpg data" ON public.agen_lpg FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete agen lpg data" ON public.agen_lpg FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for PANGKALAN LPG
CREATE POLICY "Users can view all pangkalan lpg data" ON public.pangkalan_lpg FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert pangkalan lpg data" ON public.pangkalan_lpg FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update pangkalan lpg data" ON public.pangkalan_lpg FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete pangkalan lpg data" ON public.pangkalan_lpg FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for SPBE
CREATE POLICY "Users can view all spbe data" ON public.spbe FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert spbe data" ON public.spbe FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update spbe data" ON public.spbe FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete spbe data" ON public.spbe FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for JENIS BBM
CREATE POLICY "Users can view all jenis bbm data" ON public.jenis_bbm FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert jenis bbm data" ON public.jenis_bbm FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update jenis bbm data" ON public.jenis_bbm FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete jenis bbm data" ON public.jenis_bbm FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for AGEN REALISASI GAS 3KG
CREATE POLICY "Users can view all agen realisasi gas 3kg data" ON public.agen_realisasi_gas_3kg FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert agen realisasi gas 3kg data" ON public.agen_realisasi_gas_3kg FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update agen realisasi gas 3kg data" ON public.agen_realisasi_gas_3kg FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete agen realisasi gas 3kg data" ON public.agen_realisasi_gas_3kg FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for AGEN REALISASI BBM
CREATE POLICY "Users can view all agen realisasi bbm data" ON public.agen_realisasi_bbm FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert agen realisasi bbm data" ON public.agen_realisasi_bbm FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update agen realisasi bbm data" ON public.agen_realisasi_bbm FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete agen realisasi bbm data" ON public.agen_realisasi_bbm FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updating timestamps
CREATE TRIGGER update_spbu_lpg_updated_at BEFORE UPDATE ON public.spbu_lpg FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agen_lpg_updated_at BEFORE UPDATE ON public.agen_lpg FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pangkalan_lpg_updated_at BEFORE UPDATE ON public.pangkalan_lpg FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_spbe_updated_at BEFORE UPDATE ON public.spbe FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jenis_bbm_updated_at BEFORE UPDATE ON public.jenis_bbm FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agen_realisasi_gas_3kg_updated_at BEFORE UPDATE ON public.agen_realisasi_gas_3kg FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agen_realisasi_bbm_updated_at BEFORE UPDATE ON public.agen_realisasi_bbm FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default BBM types
INSERT INTO public.jenis_bbm (nama_jenis, keterangan, satuan) VALUES 
('Pertalite', 'BBM Jenis Pertalite RON 90', 'Liter'),
('Pertamax', 'BBM Jenis Pertamax RON 92', 'Liter'),
('Pertamax Turbo', 'BBM Jenis Pertamax Turbo RON 98', 'Liter'),
('Solar', 'BBM Jenis Solar/Diesel', 'Liter'),
('Dexlite', 'BBM Jenis Dexlite', 'Liter');