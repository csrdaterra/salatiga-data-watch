// Simple LPG agent store
export interface LPGAgent {
  id: number;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  kecamatan?: string;
}

// Default LPG agents data
const defaultLPGAgents: LPGAgent[] = [
  {
    id: 1,
    name: "PT. Berlian Putra Mandiri",
    address: "Jalan Lingkar Selatan, Kel. Kumpulrejo, Kec. Argomulyo",
    longitude: "110.4789",
    latitude: "-7.3456",
    kecamatan: "Argomulyo"
  },
  {
    id: 2,
    name: "PT. Browidjojo Brojomusti Brojodento",
    address: "Jalan Diponegoro No 173, Kel. Sidorejo Lor, Kec. Sidorejo",
    longitude: "110.4872",
    latitude: "-7.3313",
    kecamatan: "Sidorejo"
  },
  {
    id: 3,
    name: "PT. Catur Karya",
    address: "Jalan Ahmad Yani No 96, Kel. Kalicacing, Kec. Sidomukti",
    longitude: "110.4912",
    latitude: "-7.3245",
    kecamatan: "Sidomukti"
  },
  {
    id: 4,
    name: "PT. Eshan Multi Energi",
    address: "Perum Dliko Indah, Kel. Sidorejo Lor, Kec. Sidorejo",
    longitude: "110.4856",
    latitude: "-7.3298",
    kecamatan: "Sidorejo"
  },
  {
    id: 5,
    name: "PT. Pancar Catur Pelita",
    address: "Jalan Diponegoro No 147, Kel. Sidorejo Lor, Kec. Sidorejo",
    longitude: "110.4867",
    latitude: "-7.3305",
    kecamatan: "Sidorejo"
  },
  {
    id: 6,
    name: "PT. Permata Gas Sejahtera",
    address: "Jalan Soekarno Hatta No 91, Kel. Dukuh, Kec. Argomulyo",
    longitude: "110.5023",
    latitude: "-7.3287",
    kecamatan: "Argomulyo"
  },
  {
    id: 7,
    name: "PT. Rakyat Makmur Nusantara",
    address: "Jalan Buksuling No 16, Kel. Kutowinangun Lor, Kec. Tingkir",
    longitude: "110.4934",
    latitude: "-7.3276",
    kecamatan: "Tingkir"
  }
];

// Simple in-memory store
let lpgAgents: LPGAgent[] = [...defaultLPGAgents];

export const getLPGAgents = (): LPGAgent[] => {
  return [...lpgAgents];
};

export const setLPGAgents = (newAgents: LPGAgent[]): void => {
  lpgAgents = [...newAgents];
};

export const addLPGAgent = (agent: LPGAgent): void => {
  lpgAgents.push(agent);
};

export const updateLPGAgent = (id: number, updatedAgent: Partial<LPGAgent>): void => {
  const index = lpgAgents.findIndex(a => a.id === id);
  if (index !== -1) {
    lpgAgents[index] = { ...lpgAgents[index], ...updatedAgent };
  }
};

export const deleteLPGAgent = (id: number): void => {
  lpgAgents = lpgAgents.filter(a => a.id !== id);
};

// Helper function to categorize agents by kecamatan
export const getLPGAgentsByKecamatan = () => {
  const agentsByKecamatan: { [key: string]: LPGAgent[] } = {};
  
  lpgAgents.forEach(agent => {
    const kecamatan = agent.kecamatan || 'Lainnya';
    if (!agentsByKecamatan[kecamatan]) {
      agentsByKecamatan[kecamatan] = [];
    }
    agentsByKecamatan[kecamatan].push(agent);
  });
  
  return agentsByKecamatan;
};