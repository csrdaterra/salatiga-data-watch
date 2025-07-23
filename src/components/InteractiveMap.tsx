import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, MapPin, Building2 } from 'lucide-react';

// Mock data for fuel stations and LPG distributors
const fuelStations = [
  {
    id: 1,
    name: "SPBU Pertamina Sidorejo",
    type: "spbu",
    lat: -7.5588,
    lng: 110.4924,
    address: "Jl. Diponegoro No. 45, Sidorejo",
    contact: "0298-321234",
    owner: "PT Pertamina Retail",
    fuels: ["Premium", "Pertamax", "Solar", "Dexlite"],
    status: "Aktif"
  },
  {
    id: 2,
    name: "Pertashop Sidomulyo",
    type: "pertashop", 
    lat: -7.5612,
    lng: 110.4856,
    address: "Jl. Veteran No. 78, Sidomulyo",
    contact: "0298-325678",
    owner: "Budi Santoso",
    fuels: ["Premium", "Solar"],
    status: "Aktif"
  },
  {
    id: 3,
    name: "SPBU Shell Tingkir",
    type: "spbu",
    lat: -7.5556,
    lng: 110.5012,
    address: "Jl. Jendral Sudirman No. 123, Tingkir",
    contact: "0298-327890",
    owner: "PT Shell Indonesia",
    fuels: ["Super", "V-Power", "Solar"],
    status: "Aktif"
  },
  {
    id: 4,
    name: "Agen LPG Berkah Gas",
    type: "lpg",
    lat: -7.5634,
    lng: 110.4978,
    address: "Jl. Kartini No. 56, Argomulyo",
    contact: "0298-329012",
    owner: "Siti Rahayu",
    fuels: ["LPG 3kg", "LPG 12kg", "LPG 5.5kg"],
    status: "Aktif"
  },
  {
    id: 5,
    name: "Distributor LPG Jaya Mandiri",
    type: "lpg",
    lat: -7.5578,
    lng: 110.4890,
    address: "Jl. Ahmad Yani No. 34, Sidorejo",
    contact: "0298-323456",
    owner: "Ahmad Wijaya",
    fuels: ["LPG 3kg", "LPG 12kg"],
    status: "Aktif"
  },
  {
    id: 6,
    name: "SPBU Vivo Argomulyo",
    type: "spbu",
    lat: -7.5645,
    lng: 110.5034,
    address: "Jl. Gatot Subroto No. 89, Argomulyo",
    contact: "0298-328765",
    owner: "PT Vivo Energy",
    fuels: ["Revvo 89", "Revvo 92", "Solar"],
    status: "Aktif"
  }
];

// Custom icons
const createIcon = (type: string) => {
  const color = type === 'spbu' ? '#2563eb' : type === 'pertashop' ? '#059669' : '#dc2626';
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">
      <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
        ${type === 'spbu' || type === 'pertashop' 
          ? '<path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/>'
          : '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>'
        }
      </svg>
    </div>
  `;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(iconHtml)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Fix for default markers
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap: React.FC = () => {
  // Center coordinates for Salatiga
  const center: [number, number] = [-7.5612, 110.4924];

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <MapPin className="w-5 h-5 mr-2" />
          Peta Distribusi BBM & LPG Salatiga
        </CardTitle>
        <CardDescription>
          Klik pada marker untuk melihat detail lokasi dan jenis bahan bakar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg overflow-hidden border">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {fuelStations.map((station) => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={createIcon(station.type)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-64">
                    <div className="flex items-center space-x-2 mb-3">
                      {station.type === 'spbu' && <Fuel className="w-5 h-5 text-blue-600" />}
                      {station.type === 'pertashop' && <Building2 className="w-5 h-5 text-green-600" />}
                      {station.type === 'lpg' && <MapPin className="w-5 h-5 text-red-600" />}
                      <h3 className="font-bold text-foreground">{station.name}</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Alamat:</span>
                        <p className="text-foreground">{station.address}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-muted-foreground">Kontak:</span>
                        <p className="text-foreground">{station.contact}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-muted-foreground">Pemilik:</span>
                        <p className="text-foreground">{station.owner}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-muted-foreground">
                          {station.type === 'lpg' ? 'Jenis LPG:' : 'Jenis BBM:'}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {station.fuels.map((fuel, index) => (
                            <Badge 
                              key={index}
                              variant="secondary"
                              className={`text-xs ${
                                station.type === 'spbu' ? 'bg-blue-100 text-blue-700' :
                                station.type === 'pertashop' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              {fuel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Badge 
                          variant="default"
                          className="bg-green-100 text-green-700"
                        >
                          {station.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-muted-foreground">SPBU</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Pertashop</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Agen LPG</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;