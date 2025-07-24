// Commodity category data store
export interface CommodityCategory {
  id: number;
  name: string;
  description: string;
  unit: string; // satuan (kg, liter, buah, dll)
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
  {
    id: 1,
    name: "Beras",
    description: "Beras berbagai jenis dan kualitas",
    unit: "kg"
  },
  {
    id: 2,
    name: "Gula Pasir",
    description: "Gula pasir putih dan merah",
    unit: "kg"
  },
  {
    id: 3,
    name: "Minyak Goreng",
    description: "Minyak goreng kemasan dan curah",
    unit: "liter"
  },
  {
    id: 4,
    name: "Telur Ayam",
    description: "Telur ayam segar",
    unit: "kg"
  },
  {
    id: 5,
    name: "Daging Ayam",
    description: "Daging ayam segar dan beku",
    unit: "kg"
  },
  {
    id: 6,
    name: "Daging Sapi",
    description: "Daging sapi segar",
    unit: "kg"
  },
  {
    id: 7,
    name: "Cabai Merah",
    description: "Cabai merah segar",
    unit: "kg"
  },
  {
    id: 8,
    name: "Bawang Merah",
    description: "Bawang merah lokal dan impor",
    unit: "kg"
  },
  {
    id: 9,
    name: "Bawang Putih",
    description: "Bawang putih lokal dan impor",
    unit: "kg"
  },
  {
    id: 10,
    name: "Sayuran Hijau",
    description: "Bayam, kangkung, sawi, dll",
    unit: "ikat"
  }
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