
// Simple market data store that can be shared across components
export interface Market {
  id: number;
  name: string;
  address: string;
  contact: string;
  longitude: string;
  latitude: string;
  kecamatan?: string;
}

// Default markets data
const defaultMarkets: Market[] = [
  {
    id: 1,
    name: "Pasar Argosari",
    address: "Jl. Diponegoro No. 123, Salatiga",
    contact: "0298-321123",
    longitude: "110.4872",
    latitude: "-7.3313",
    kecamatan: "Sidorejo"
  },
  {
    id: 2,
    name: "Pasar Raya Salatiga",
    address: "Jl. Ahmad Yani No. 45, Salatiga",
    contact: "0298-321456",
    longitude: "110.4928",
    latitude: "-7.3298",
    kecamatan: "Tingkir"
  }
];

// Simple in-memory store (in a real app, this would be connected to a database)
let markets: Market[] = [...defaultMarkets];

export const getMarkets = (): Market[] => {
  return [...markets];
};

export const setMarkets = (newMarkets: Market[]): void => {
  markets = [...newMarkets];
};

export const addMarket = (market: Market): void => {
  markets.push(market);
};

export const updateMarket = (id: number, updatedMarket: Partial<Market>): void => {
  const index = markets.findIndex(m => m.id === id);
  if (index !== -1) {
    markets[index] = { ...markets[index], ...updatedMarket };
  }
};

export const deleteMarket = (id: number): void => {
  markets = markets.filter(m => m.id !== id);
};

// Helper function to categorize markets by kecamatan
export const getMarketsByKecamatan = () => {
  const marketsByKecamatan: { [key: string]: Market[] } = {};
  
  markets.forEach(market => {
    const kecamatan = market.kecamatan || 'Lainnya';
    if (!marketsByKecamatan[kecamatan]) {
      marketsByKecamatan[kecamatan] = [];
    }
    marketsByKecamatan[kecamatan].push(market);
  });
  
  return marketsByKecamatan;
};
