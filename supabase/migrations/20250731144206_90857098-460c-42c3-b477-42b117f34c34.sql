-- Create commodities table for 50 essential commodities
CREATE TABLE public.commodities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  description TEXT,
  is_essential BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on commodities table
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;

-- Create policies for commodities
CREATE POLICY "Users can view all commodities" 
ON public.commodities 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert commodities" 
ON public.commodities 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update commodities" 
ON public.commodities 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete commodities" 
ON public.commodities 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert 50 essential commodities data
INSERT INTO public.commodities (name, category, unit, description) VALUES
-- Beras dan Serealia
('Beras Medium', 'Beras dan Serealia', 'kg', 'Beras kualitas medium'),
('Beras Premium', 'Beras dan Serealia', 'kg', 'Beras kualitas premium'),
('Jagung Pipilan Kering', 'Beras dan Serealia', 'kg', 'Jagung pipilan kering'),
('Tepung Terigu', 'Beras dan Serealia', 'kg', 'Tepung terigu curah'),

-- Umbi-umbian
('Singkong', 'Umbi-umbian', 'kg', 'Singkong segar'),
('Ubi Jalar', 'Umbi-umbian', 'kg', 'Ubi jalar segar'),
('Kentang', 'Umbi-umbian', 'kg', 'Kentang segar'),

-- Ikan dan Daging
('Ikan Tongkol', 'Ikan dan Daging', 'kg', 'Ikan tongkol segar'),
('Ikan Bandeng', 'Ikan dan Daging', 'kg', 'Ikan bandeng segar'),
('Ikan Mas', 'Ikan dan Daging', 'kg', 'Ikan mas segar'),
('Daging Sapi', 'Ikan dan Daging', 'kg', 'Daging sapi segar'),
('Daging Ayam', 'Ikan dan Daging', 'kg', 'Daging ayam broiler'),
('Telur Ayam', 'Ikan dan Daging', 'kg', 'Telur ayam ras'),

-- Sayuran
('Bawang Merah', 'Sayuran', 'kg', 'Bawang merah segar'),
('Bawang Putih', 'Sayuran', 'kg', 'Bawang putih segar'),
('Cabai Merah', 'Sayuran', 'kg', 'Cabai merah besar'),
('Cabai Rawit', 'Sayuran', 'kg', 'Cabai rawit'),
('Tomat', 'Sayuran', 'kg', 'Tomat segar'),
('Wortel', 'Sayuran', 'kg', 'Wortel segar'),
('Kangkung', 'Sayuran', 'kg', 'Kangkung segar'),
('Bayam', 'Sayuran', 'kg', 'Bayam segar'),
('Kacang Panjang', 'Sayuran', 'kg', 'Kacang panjang segar'),
('Terong', 'Sayuran', 'kg', 'Terong segar'),

-- Buah-buahan
('Pisang', 'Buah-buahan', 'kg', 'Pisang ambon'),
('Jeruk', 'Buah-buahan', 'kg', 'Jeruk manis'),
('Apel', 'Buah-buahan', 'kg', 'Apel malang'),
('Mangga', 'Buah-buahan', 'kg', 'Mangga gedong'),
('Pepaya', 'Buah-buahan', 'kg', 'Pepaya california'),

-- Kacang-kacangan
('Kacang Tanah', 'Kacang-kacangan', 'kg', 'Kacang tanah kupas'),
('Kacang Hijau', 'Kacang-kacangan', 'kg', 'Kacang hijau kupas'),
('Tahu', 'Kacang-kacangan', 'kg', 'Tahu putih'),
('Tempe', 'Kacang-kacangan', 'kg', 'Tempe kedele'),

-- Susu dan Olahannya
('Susu Kental Manis', 'Susu dan Olahannya', 'kaleng', 'Susu kental manis'),
('Susu Bubuk', 'Susu dan Olahannya', 'kg', 'Susu bubuk dewasa'),

-- Minyak dan Lemak
('Minyak Goreng', 'Minyak dan Lemak', 'liter', 'Minyak goreng curah'),
('Kelapa', 'Minyak dan Lemak', 'butir', 'Kelapa tua'),

-- Bumbu-bumbuan
('Garam', 'Bumbu-bumbuan', 'kg', 'Garam beryodium'),
('Gula Pasir', 'Bumbu-bumbuan', 'kg', 'Gula pasir lokal'),
('Kecap Manis', 'Bumbu-bumbuan', 'botol', 'Kecap manis'),
('Merica', 'Bumbu-bumbuan', 'kg', 'Merica bubuk'),

-- Rokok dan Tembakau
('Rokok Kretek', 'Rokok dan Tembakau', 'batang', 'Rokok kretek'),
('Rokok Filter', 'Rokok dan Tembakau', 'batang', 'Rokok putih filter'),

-- Perumahan dan Fasilitas
('Semen', 'Perumahan dan Fasilitas', 'sak', 'Semen portland'),
('Genteng', 'Perumahan dan Fasilitas', 'buah', 'Genteng tanah liat'),
('Bata Merah', 'Perumahan dan Fasilitas', 'buah', 'Bata merah'),

-- Sandang
('Sarung', 'Sandang', 'helai', 'Sarung katun'),
('Kain Batik', 'Sandang', 'meter', 'Kain batik printing'),

-- Jasa
('Tarif Angkutan', 'Jasa', 'ongkos', 'Tarif angkutan dalam kota'),
('Upah Tukang', 'Jasa', 'hari', 'Upah tukang bangunan'),

-- Emas
('Emas', 'Emas', 'gram', 'Emas 24 karat'),

-- BBM
('Bensin', 'BBM', 'liter', 'Bensin premium'),
('Solar', 'BBM', 'liter', 'Solar industri'),
('Minyak Tanah', 'BBM', 'liter', 'Minyak tanah rumah tangga'),

-- LPG
('LPG 3kg', 'LPG', 'tabung', 'LPG 3kg bersubsidi'),
('LPG 12kg', 'LPG', 'tabung', 'LPG 12kg non-subsidi');

-- Create trigger for updated_at on commodities
CREATE TRIGGER update_commodities_updated_at
  BEFORE UPDATE ON public.commodities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update price_surveys table to ensure proper relationship with commodities
-- The table already exists but let's make sure commodity_id references the commodities table
-- This will be handled through foreign key relationships in the application logic