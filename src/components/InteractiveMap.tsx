import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, MapPin, Building2 } from 'lucide-react';

// Simplified map placeholder
const InteractiveMap: React.FC = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <MapPin className="w-5 h-5 mr-2" />
          Peta Distribusi BBM & LPG Salatiga
        </CardTitle>
        <CardDescription>
          Peta interaktif akan ditampilkan di sini (sementara dalam pengembangan)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg border bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Peta Salatiga</h3>
              <p className="text-muted-foreground">Menampilkan lokasi SPBU, Pertashop, dan Agen LPG</p>
            </div>
          </div>
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