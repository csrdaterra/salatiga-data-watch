// Store for managing large stores data
interface LargeStore {
  id: number;
  storeName: string;
  ownerName: string;
  address: string;
  contact: string;
  commodities: string;
  longitude: string;
  latitude: string;
}

// Default large stores data
const defaultStores: LargeStore[] = [
  {
    id: 1,
    storeName: "CV. Sinar Inti Pandawa",
    ownerName: "Budi Santoso",
    address: "Jl. Veteran No. 123, Salatiga",
    contact: "0298-321123",
    commodities: "Sembako, Elektronik",
    longitude: "110.4940",
    latitude: "-7.3290"
  },
  {
    id: 2,
    storeName: "Toko Sari Rejo",
    ownerName: "Siti Nurlaela",
    address: "Jl. Diponegoro No. 45, Salatiga",
    contact: "0298-311234",
    commodities: "Sembako, Pakaian",
    longitude: "110.4950",
    latitude: "-7.3280"
  },
  {
    id: 3,
    storeName: "Hypermarket Global",
    ownerName: "PT. Global Mandiri",
    address: "Jl. Raya Solo-Yogya KM 46, Salatiga",
    contact: "0298-322456",
    commodities: "Sembako, Elektronik, Pakaian, Makanan",
    longitude: "110.4930",
    latitude: "-7.3310"
  },
  {
    id: 4,
    storeName: "Supermarket Sejahtera",
    ownerName: "Ahmad Wijaya",
    address: "Jl. Kartini No. 78, Salatiga",
    contact: "0298-333789",
    commodities: "Sembako, Makanan, Minuman",
    longitude: "110.4960",
    latitude: "-7.3270"
  },
  {
    id: 5,
    storeName: "Toko Berkah Jaya",
    ownerName: "Indra Kusuma",
    address: "Jl. Ahmad Yani No. 90, Salatiga",
    contact: "0298-345678",
    commodities: "Sembako, Alat Rumah Tangga",
    longitude: "110.4920",
    latitude: "-7.3320"
  },
  {
    id: 6,
    storeName: "Giant Supermarket",
    ownerName: "PT. Hero Supermarket",
    address: "Jl. Jenderal Sudirman No. 200, Salatiga",
    contact: "0298-356789",
    commodities: "Sembako, Elektronik, Pakaian, Makanan, Minuman",
    longitude: "110.4910",
    latitude: "-7.3330"
  }
];

// Store state
let stores: LargeStore[] = [...defaultStores];

// Store management functions
export const getLargeStores = (): LargeStore[] => {
  return [...stores];
};

export const setLargeStores = (newStores: LargeStore[]): void => {
  stores = [...newStores];
};

export const addLargeStore = (store: LargeStore): void => {
  stores.push(store);
};

export const updateLargeStore = (id: number, updatedStore: Partial<LargeStore>): void => {
  const index = stores.findIndex(store => store.id === id);
  if (index !== -1) {
    stores[index] = { ...stores[index], ...updatedStore };
  }
};

export const deleteLargeStore = (id: number): void => {
  stores = stores.filter(store => store.id !== id);
};

export const getLargeStoreById = (id: number): LargeStore | undefined => {
  return stores.find(store => store.id === id);
};

export const getLargeStoreNames = (): string[] => {
  return stores.map(store => store.storeName);
};

export { type LargeStore };