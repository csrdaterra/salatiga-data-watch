// Commodity category data store
export interface CommodityCategory {
  id: number;
  name: string;
  description: string;
  unit: string; // satuan (kg, liter, buah, dll)
  category: string; // kategori komoditas
}

export interface MarketCommodity {
  marketId: number;
  commodityId: number;
  availability: boolean;
  averagePrice?: number;
  notes?: string;
}

// Default commodity categories
const defaultCommodities: CommodityCategory[] = [
  { id: 1, name: "Beras Medium", description: "Beras kualitas medium", unit: "kg", category: "beras" },
  { id: 2, name: "Beras Premium", description: "Beras kualitas premium", unit: "kg", category: "beras" },
  { id: 3, name: "Kedelai Lokal", description: "Kedelai produksi lokal", unit: "kg", category: "kedelai" },
  { id: 4, name: "Kedelai Impor", description: "Kedelai impor", unit: "kg", category: "kedelai" },
  { id: 5, name: "Cabai Merah Keriting", description: "Cabai merah keriting segar", unit: "kg", category: "cabai" },
  { id: 6, name: "Cabai Merah Besar", description: "Cabai merah besar segar", unit: "kg", category: "cabai" },
  { id: 7, name: "Cabai Rawit Merah", description: "Cabai rawit merah segar", unit: "kg", category: "cabai" },
  { id: 8, name: "Cabai Rawit Hijau", description: "Cabai rawit hijau segar", unit: "kg", category: "cabai" },
  { id: 9, name: "Bawang Merah", description: "Bawang merah lokal", unit: "kg", category: "bawang" },
  { id: 10, name: "Bawang Putih Honan", description: "Bawang putih jenis Honan", unit: "kg", category: "bawang" },
  { id: 11, name: "Bawang Putih Kating", description: "Bawang putih jenis Kating", unit: "kg", category: "bawang" },
  { id: 12, name: "Bawang Bombay", description: "Bawang bombay", unit: "kg", category: "bawang" },
  { id: 13, name: "Gula Pasir Curah", description: "Gula pasir curah", unit: "kg", category: "gula pasir" },
  { id: 14, name: "Gula Pasir Kemasan", description: "Gula pasir kemasan", unit: "kg", category: "gula pasir" },
  { id: 15, name: "Minyak Goreng Curah", description: "Minyak goreng curah", unit: "liter", category: "minyak goreng" },
  { id: 16, name: "Minyak Goreng Premium", description: "Minyak goreng premium", unit: "liter", category: "minyak goreng" },
  { id: 17, name: "Minyak Goreng Minyakita", description: "Minyak goreng merk Minyakita", unit: "liter", category: "minyak goreng" },
  { id: 18, name: "Tepung Terigu Protein Tinggi", description: "Tepung terigu protein tinggi", unit: "kg", category: "tepung terigu" },
  { id: 19, name: "Tepung Terigu Protein Sedang", description: "Tepung terigu protein sedang", unit: "kg", category: "tepung terigu" },
  { id: 20, name: "Tepung Terigu Protein Rendah", description: "Tepung terigu protein rendah", unit: "kg", category: "tepung terigu" },
  { id: 21, name: "Daging Ayam Ras", description: "Daging ayam ras segar", unit: "kg", category: "daging" },
  { id: 22, name: "Daging Ayam Kampung", description: "Daging ayam kampung segar", unit: "kg", category: "daging" },
  { id: 23, name: "Daging Sapi Bagian Paha Belakang", description: "Daging sapi paha belakang", unit: "kg", category: "daging" },
  { id: 24, name: "Daging Sapi Bagian Paha Depan", description: "Daging sapi paha depan", unit: "kg", category: "daging" },
  { id: 25, name: "Daging Sapi Bagian Sandung Lamur", description: "Daging sapi sandung lamur", unit: "kg", category: "daging" },
  { id: 26, name: "Daging Sapi Bagian Tetelan", description: "Daging sapi tetelan", unit: "kg", category: "daging" },
  { id: 27, name: "Telur Ayam Ras", description: "Telur ayam ras segar", unit: "kg", category: "daging" },
  { id: 28, name: "Telur Ayam Kampung", description: "Telur ayam kampung segar", unit: "kg", category: "daging" },
  { id: 29, name: "Ikan Bandeng", description: "Ikan bandeng segar", unit: "kg", category: "daging" },
  { id: 30, name: "Ikan Kembung", description: "Ikan kembung segar", unit: "kg", category: "daging" },
  { id: 31, name: "Ikan Tongkol/Tuna/Cangkalang", description: "Ikan tongkol, tuna, atau cangkalang", unit: "kg", category: "daging" },
  { id: 32, name: "Ikan Teri Asin", description: "Ikan teri asin", unit: "kg", category: "daging" },
  { id: 33, name: "Udang Segar", description: "Udang segar", unit: "kg", category: "daging" },
  { id: 34, name: "Tempe Kedelai", description: "Tempe kedelai", unit: "kg", category: "kedelai" },
  { id: 35, name: "Tahu Mentah Putih", description: "Tahu mentah putih", unit: "kg", category: "kedelai" },
  { id: 36, name: "Tomat", description: "Tomat segar", unit: "kg", category: "sayuran" },
  { id: 37, name: "Ketimun", description: "Ketimun segar", unit: "kg", category: "sayuran" },
  { id: 38, name: "Sawi Hijau", description: "Sawi hijau segar", unit: "kg", category: "sayuran" },
  { id: 39, name: "Kangkung", description: "Kangkung segar", unit: "kg", category: "sayuran" },
  { id: 40, name: "Kacang Panjang", description: "Kacang panjang segar", unit: "kg", category: "sayuran" },
  { id: 41, name: "Kentang", description: "Kentang segar", unit: "kg", category: "sayuran" },
  { id: 42, name: "Pisang Lokal", description: "Pisang lokal", unit: "kg", category: "buah" },
  { id: 43, name: "Jeruk Lokal", description: "Jeruk lokal", unit: "kg", category: "buah" },
  { id: 44, name: "Jagung Pipilan", description: "Jagung pipilan", unit: "kg", category: "lainnya" },
  { id: 45, name: "Mie Intan Kari", description: "Mie instan rasa kari", unit: "bungkus", category: "lainnya" },
  { id: 46, name: "Garam Halus", description: "Garam halus", unit: "kg", category: "lainnya" },
  { id: 47, name: "Susu Kental Manis Kaleng (Frisian Flag 370g)", description: "Susu kental manis Frisian Flag 370g", unit: "kaleng", category: "lainnya" },
  { id: 48, name: "Susu Bubuk (Dancow 390gr)", description: "Susu bubuk Dancow 390gr", unit: "pak", category: "lainnya" },
  { id: 49, name: "Ketela Pohon", description: "Ketela pohon", unit: "kg", category: "sayuran" },
  { id: 50, name: "Kacang Hijau", description: "Kacang hijau", unit: "kg", category: "kedelai" }
];

// Default market-commodity relationships
const defaultMarketCommodities: MarketCommodity[] = [
  // Pasar Raya I
  { marketId: 1, commodityId: 1, availability: true, averagePrice: 12000 },
  { marketId: 1, commodityId: 2, availability: true, averagePrice: 15000 },
  { marketId: 1, commodityId: 3, availability: true, averagePrice: 18000 },
  { marketId: 1, commodityId: 4, availability: true, averagePrice: 25000 },
  { marketId: 1, commodityId: 5, availability: true, averagePrice: 35000 },
  { marketId: 1, commodityId: 7, availability: true, averagePrice: 40000 },
  { marketId: 1, commodityId: 8, availability: true, averagePrice: 30000 },
  { marketId: 1, commodityId: 10, availability: true, averagePrice: 3000 },
  
  // Pasar Rejosari
  { marketId: 2, commodityId: 1, availability: true, averagePrice: 11500 },
  { marketId: 2, commodityId: 2, availability: true, averagePrice: 14500 },
  { marketId: 2, commodityId: 3, availability: true, averagePrice: 17500 },
  { marketId: 2, commodityId: 4, availability: true, averagePrice: 24000 },
  { marketId: 2, commodityId: 7, availability: true, averagePrice: 38000 },
  { marketId: 2, commodityId: 8, availability: true, averagePrice: 28000 },
  { marketId: 2, commodityId: 9, availability: true, averagePrice: 35000 },
  { marketId: 2, commodityId: 10, availability: true, averagePrice: 2500 },
  
  // Pasar Blauran I
  { marketId: 3, commodityId: 1, availability: true, averagePrice: 12500 },
  { marketId: 3, commodityId: 2, availability: true, averagePrice: 15500 },
  { marketId: 3, commodityId: 4, availability: true, averagePrice: 26000 },
  { marketId: 3, commodityId: 6, availability: true, averagePrice: 120000 },
  { marketId: 3, commodityId: 7, availability: true, averagePrice: 42000 },
  { marketId: 3, commodityId: 8, availability: true, averagePrice: 32000 },
  { marketId: 3, commodityId: 9, availability: true, averagePrice: 38000 },
  { marketId: 3, commodityId: 10, availability: true, averagePrice: 3500 }
];

// In-memory stores
let commodities: CommodityCategory[] = [...defaultCommodities];
let marketCommodities: MarketCommodity[] = [...defaultMarketCommodities];

// Commodity Categories Functions
export const getCommodities = (): CommodityCategory[] => {
  return [...commodities];
};

export const setCommodities = (newCommodities: CommodityCategory[]): void => {
  commodities = [...newCommodities];
};

export const addCommodity = (commodity: CommodityCategory): void => {
  commodities.push(commodity);
};

export const updateCommodity = (id: number, updatedCommodity: Partial<CommodityCategory>): void => {
  const index = commodities.findIndex(c => c.id === id);
  if (index !== -1) {
    commodities[index] = { ...commodities[index], ...updatedCommodity };
  }
};

export const deleteCommodity = (id: number): void => {
  commodities = commodities.filter(c => c.id !== id);
  // Also remove related market-commodity relationships
  marketCommodities = marketCommodities.filter(mc => mc.commodityId !== id);
};

// Market-Commodity Relationship Functions
export const getMarketCommodities = (): MarketCommodity[] => {
  return [...marketCommodities];
};

export const getMarketCommoditiesByMarket = (marketId: number): MarketCommodity[] => {
  return marketCommodities.filter(mc => mc.marketId === marketId);
};

export const getCommoditiesByMarket = (marketId: number): CommodityCategory[] => {
  const marketCommodityIds = marketCommodities
    .filter(mc => mc.marketId === marketId && mc.availability)
    .map(mc => mc.commodityId);
  
  return commodities.filter(c => marketCommodityIds.includes(c.id));
};

export const getMarketsByCommodity = (commodityId: number): number[] => {
  return marketCommodities
    .filter(mc => mc.commodityId === commodityId && mc.availability)
    .map(mc => mc.marketId);
};

export const addMarketCommodity = (marketCommodity: MarketCommodity): void => {
  // Remove existing relationship if any
  marketCommodities = marketCommodities.filter(
    mc => !(mc.marketId === marketCommodity.marketId && mc.commodityId === marketCommodity.commodityId)
  );
  marketCommodities.push(marketCommodity);
};

export const updateMarketCommodity = (
  marketId: number, 
  commodityId: number, 
  updatedData: Partial<MarketCommodity>
): void => {
  const index = marketCommodities.findIndex(
    mc => mc.marketId === marketId && mc.commodityId === commodityId
  );
  if (index !== -1) {
    marketCommodities[index] = { ...marketCommodities[index], ...updatedData };
  }
};

export const removeMarketCommodity = (marketId: number, commodityId: number): void => {
  marketCommodities = marketCommodities.filter(
    mc => !(mc.marketId === marketId && mc.commodityId === commodityId)
  );
};

// Helper function to get commodity availability summary
export const getCommodityAvailabilitySummary = () => {
  const summary: { [commodityName: string]: { availableMarkets: number; totalMarkets: number } } = {};
  
  commodities.forEach(commodity => {
    const availableMarkets = marketCommodities.filter(
      mc => mc.commodityId === commodity.id && mc.availability
    ).length;
    
    summary[commodity.name] = {
      availableMarkets,
      totalMarkets: 3 // Assuming we have 3 markets, this could be dynamic
    };
  });
  
  return summary;
};