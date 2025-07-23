// Gas station store with fuel types
export interface GasStation {
  id: number;
  name: string;
  address: string;
  fuelTypes: string[];
  longitude: string;
  latitude: string;
  kecamatan?: string;
}

// Default gas stations data from Salatiga
const defaultGasStations: GasStation[] = [
  {
    id: 1,
    name: "SPBU 43.507.16",
    address: "Jalan Lingkar Selatan Gamol",
    fuelTypes: ["Pertalite", "Pertamax", "Pertamax Turbo", "Bio Solar", "Dexlite", "Pertamina Dex"],
    longitude: "110.4789",
    latitude: "-7.3456",
  },
  {
    id: 2,
    name: "SPBU 44.501.17",
    address: "Jalan Osamaliki",
    fuelTypes: ["Pertalite", "Pertamax", "Pertamax Turbo", "Bio Solar", "Dexlite", "Pertamina Dex"],
    longitude: "110.4823",
    latitude: "-7.3398",
  },
  {
    id: 3,
    name: "SPBU 44.507.04",
    address: "Jalan Soekarno Hatta KM 4, Tingkir",
    fuelTypes: ["Pertalite", "Pertamax", "Bio Solar", "Dexlite"],
    longitude: "110.5145",
    latitude: "-7.3287",
    kecamatan: "Tingkir"
  },
  {
    id: 4,
    name: "SPBU 44.507.05",
    address: "Jalan Diponegoro Nomor 173",
    fuelTypes: ["Pertalite", "Pertamax", "Bio Solar", "Dexlite"],
    longitude: "110.4872",
    latitude: "-7.3313",
  },
  {
    id: 5,
    name: "SPBU 44.507.06",
    address: "Jalan Veteran Nomor 139",
    fuelTypes: ["Pertalite", "Pertamax", "Bio Solar", "Pertamina Dex"],
    longitude: "110.4901",
    latitude: "-7.3276",
  },
  {
    id: 6,
    name: "SPBU 44.507.11",
    address: "Jalan Imam Bonjol Nomor 27",
    fuelTypes: ["Pertalite", "Pertamax", "Bio Solar", "Dexlite"],
    longitude: "110.4934",
    latitude: "-7.3298",
  },
  {
    id: 7,
    name: "SPBU 44.507.13",
    address: "Jalan Brigjen Sudiarto Nomor 5-7",
    fuelTypes: ["Pertalite", "Pertamax", "Bio Solar", "Pertamina Dex"],
    longitude: "110.4856",
    latitude: "-7.3254",
  },
  {
    id: 8,
    name: "SPBU 44.507.14",
    address: "Jalan Pattimura Nomor 63, Kota Salatiga",
    fuelTypes: ["Pertalite", "Pertamax", "Pertamax Turbo", "Bio Solar", "Dexlite", "Pertamina Dex"],
    longitude: "110.4889",
    latitude: "-7.3341",
  },
  {
    id: 9,
    name: "SPBU 44.507.15",
    address: "Jalan Tingkir-Suruh KM 01, Payaman",
    fuelTypes: ["Pertalite", "Pertamax", "Bio Solar", "Dexlite"],
    longitude: "110.5023",
    latitude: "-7.3156",
  },
  {
    id: 10,
    name: "SPBU 44.507.22",
    address: "Jalan Lingkar Selatan, Kelurahan Kecandran",
    fuelTypes: ["Pertalite", "Pertamax", "Pertamax Turbo", "Bio Solar", "Dexlite"],
    longitude: "110.4767",
    latitude: "-7.3434",
  }
];

// Simple in-memory store
let gasStations: GasStation[] = [...defaultGasStations];

export const getGasStations = (): GasStation[] => {
  return [...gasStations];
};

export const setGasStations = (newStations: GasStation[]): void => {
  gasStations = [...newStations];
};

export const addGasStation = (station: GasStation): void => {
  gasStations.push(station);
};

export const updateGasStation = (id: number, updatedStation: Partial<GasStation>): void => {
  const index = gasStations.findIndex(s => s.id === id);
  if (index !== -1) {
    gasStations[index] = { ...gasStations[index], ...updatedStation };
  }
};

export const deleteGasStation = (id: number): void => {
  gasStations = gasStations.filter(s => s.id !== id);
};

// Helper function to categorize gas stations by kecamatan
export const getGasStationsByKecamatan = () => {
  const stationsByKecamatan: { [key: string]: GasStation[] } = {};
  
  gasStations.forEach(station => {
    const kecamatan = station.kecamatan || 'Lainnya';
    if (!stationsByKecamatan[kecamatan]) {
      stationsByKecamatan[kecamatan] = [];
    }
    stationsByKecamatan[kecamatan].push(station);
  });
  
  return stationsByKecamatan;
};

// Available fuel types
export const FUEL_TYPES = [
  "Pertalite",
  "Pertamax", 
  "Pertamax Turbo",
  "Bio Solar",
  "Dexlite", 
  "Pertamina Dex"
];