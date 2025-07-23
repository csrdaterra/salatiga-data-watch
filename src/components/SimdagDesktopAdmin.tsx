import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MapPin, 
  Fuel, 
  Building2, 
  Store, 
  TrendingUp, 
  Download, 
  Filter, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Search,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the admin dashboard
const monthlyPriceData = [
  { date: "2024-01-01", beras: 12000, cabai: 25000, telur: 24000, minyak: 17000 },
  { date: "2024-01-05", beras: 12200, cabai: 27000, telur: 25000, minyak: 17500 },
  { date: "2024-01-10", beras: 12400, cabai: 29000, telur: 25500, minyak: 18000 },
  { date: "2024-01-15", beras: 12500, cabai: 28000, telur: 26000, minyak: 18500 },
  { date: "2024-01-20", beras: 12650, cabai: 32000, telur: 26500, minyak: 19000 },
  { date: "2024-01-25", beras: 12800, cabai: 35000, telur: 27000, minyak: 19500 },
];

const lpgBbmData = [
  { agent: "PT Elpiji Jaya", location: "Sidorejo", lpg3kg: 850, lpg12kg: 320, premium: 15000, solar: 12500, status: "Normal" },
  { agent: "UD Berkah Gas", location: "Sidomulyo", lpg3kg: 650, lpg12kg: 280, premium: 12000, solar: 10000, status: "Monitoring" },
  { agent: "CV Gas Mandiri", location: "Argomulyo", lpg3kg: 720, lpg12kg: 250, premium: 8500, solar: 7500, status: "Normal" },
  { agent: "Pertamina Depot", location: "Tingkir", lpg3kg: 1200, lpg12kg: 450, premium: 25000, solar: 20000, status: "Alert" },
];

const summaryWidgets = [
  { title: "Ekspor Bulan Ini", value: "245 Ton", change: "+12.5%", trend: "up", icon: TrendingUp, color: "green" },
  { title: "Impor Bulan Ini", value: "1,840 Ton", change: "-3.2%", trend: "down", icon: TrendingUp, color: "red" },
  { title: "Inspeksi Metrologi", value: "89/120", change: "74.2%", trend: "up", icon: CheckCircle, color: "blue" },
  { title: "Stock Pangan Aman", value: "15/18", change: "83.3%", trend: "up", icon: Building2, color: "green" },
];

const SimdagDesktopAdmin = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [mapboxToken, setMapboxToken] = useState("");

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Mapbox integration would go here
    // For now, we'll show a placeholder
  }, [mapboxToken]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">SIMDAG Admin Dashboard</h1>
                  <p className="text-sm text-blue-600">Sistem Informasi Perdagangan Salatiga</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">SAL</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Cari data..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryWidgets.map((widget, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{widget.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{widget.value}</p>
                    <p className={`text-sm ${widget.color === 'green' ? 'text-green-600' : widget.color === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
                      {widget.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    widget.color === 'green' ? 'bg-green-100' : 
                    widget.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <widget.icon className={`w-6 h-6 ${
                      widget.color === 'green' ? 'text-green-600' : 
                      widget.color === 'red' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Peta Salatiga
                </CardTitle>
                <Select value={selectedKecamatan} onValueChange={setSelectedKecamatan}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kecamatan</SelectItem>
                    <SelectItem value="sidorejo">Sidorejo</SelectItem>
                    <SelectItem value="sidomulyo">Sidomulyo</SelectItem>
                    <SelectItem value="tingkir">Tingkir</SelectItem>
                    <SelectItem value="argomulyo">Argomulyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {!mapboxToken ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Masukkan Mapbox Public Token untuk menampilkan peta:</p>
                  <Input
                    placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Dapatkan token di{" "}
                    <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      mapbox.com
                    </a>
                  </p>
                </div>
              ) : (
                <div ref={mapContainer} className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Peta Salatiga akan ditampilkan di sini</p>
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Store className="w-3 h-3 text-green-600" />
                  <span>Pasar (3)</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Fuel className="w-3 h-3 text-blue-600" />
                  <span>SPBU (8)</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-orange-600" />
                  <span>Agen LPG (12)</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-purple-600" />
                  <span>Gudang (5)</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Price Trend Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-900">Tren Harga Komoditas (30 Hari)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPriceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Harga']}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                    />
                    <Line type="monotone" dataKey="beras" stroke="#2563eb" strokeWidth={2} name="Beras" />
                    <Line type="monotone" dataKey="cabai" stroke="#dc2626" strokeWidth={2} name="Cabai" />
                    <Line type="monotone" dataKey="telur" stroke="#059669" strokeWidth={2} name="Telur" />
                    <Line type="monotone" dataKey="minyak" stroke="#d97706" strokeWidth={2} name="Minyak" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LPG & BBM Distribution Table */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 flex items-center">
                <Fuel className="w-5 h-5 mr-2" />
                Monitoring Distribusi LPG & BBM
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agen</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>LPG 3kg (tabung)</TableHead>
                  <TableHead>LPG 12kg (tabung)</TableHead>
                  <TableHead>Premium (liter)</TableHead>
                  <TableHead>Solar (liter)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lpgBbmData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.agent}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.lpg3kg.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{row.lpg12kg.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{row.premium.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{row.solar.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={row.status === "Normal" ? "default" : row.status === "Alert" ? "destructive" : "secondary"}
                        className={
                          row.status === "Normal" ? "bg-green-100 text-green-700" :
                          row.status === "Alert" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {row.status === "Normal" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {row.status === "Alert" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {row.status === "Monitoring" && <Clock className="w-3 h-3 mr-1" />}
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimdagDesktopAdmin;