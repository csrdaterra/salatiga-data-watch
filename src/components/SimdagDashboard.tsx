import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  MapPin, 
  BarChart3,
  ShoppingCart,
  Fuel,
  Warehouse,
  Scale,
  Globe,
  Menu,
  Bell,
  Search,
  Calendar,
  FileText
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data for commodity prices
const priceData = [
  { date: "2024-01-15", beras: 12500, cabai: 28000, gula: 14500, telur: 26000, minyak: 18500 },
  { date: "2024-01-16", beras: 12600, cabai: 30000, gula: 14300, telur: 25500, minyak: 18800 },
  { date: "2024-01-17", beras: 12450, cabai: 32000, gula: 14600, telur: 26200, minyak: 19000 },
  { date: "2024-01-18", beras: 12700, cabai: 29500, gula: 14400, telur: 25800, minyak: 18600 },
  { date: "2024-01-19", beras: 12550, cabai: 31000, gula: 14700, telur: 26400, minyak: 19200 },
  { date: "2024-01-20", beras: 12800, cabai: 33500, gula: 14200, telur: 25600, minyak: 18900 },
  { date: "2024-01-21", beras: 12650, cabai: 35000, gula: 14800, telur: 26800, minyak: 19400 },
];

const todayAlerts = [
  { commodity: "Cabai Merah", price: 35000, change: 12.5, trend: "up", market: "Pasar Pagi" },
  { commodity: "Telur Ayam", price: 26800, change: -3.2, trend: "down", market: "Pasar Rejosari" },
  { commodity: "Beras Premium", price: 12650, change: 1.8, trend: "up", market: "Pasar Klewer" },
  { commodity: "Minyak Goreng", price: 19400, change: 5.4, trend: "up", market: "Pasar Pagi" },
];

const marketData = [
  { market: "Pasar Pagi", traders: 125, active: 118, status: "Normal" },
  { market: "Pasar Rejosari", traders: 89, active: 83, status: "Monitoring" },
  { market: "Pasar Klewer", traders: 67, active: 65, status: "Normal" },
];

const SimdagDashboard = () => {
  const [selectedCommodity, setSelectedCommodity] = useState("cabai");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-blue-900">SIMDAG</h1>
                <p className="text-xs text-blue-600">Sistem Informasi Perdagangan Salatiga</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Today's Price Alerts */}
        <Card className="shadow-md border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Peringatan Harga Hari Ini</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {new Date().toLocaleDateString('id-ID')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {todayAlerts.map((alert, index) => (
                <div key={index} className="bg-gradient-to-r from-white to-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{alert.commodity}</span>
                    {alert.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-900">
                      Rp {alert.price.toLocaleString('id-ID')}
                    </p>
                    <p className={`text-xs ${alert.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                      {alert.trend === "up" ? "+" : ""}{alert.change}% dari kemarin
                    </p>
                    <p className="text-xs text-gray-500">{alert.market}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Kepokmas</span>
            </TabsTrigger>
            <TabsTrigger value="fuel" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Fuel className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">LPG & BBM</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Warehouse className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Stock Pangan</span>
            </TabsTrigger>
            <TabsTrigger value="trade" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Globe className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ekspor-Impor</span>
            </TabsTrigger>
            <TabsTrigger value="local" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Perdagangan</span>
            </TabsTrigger>
            <TabsTrigger value="metrology" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Scale className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Metrologi</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Price Trend Chart */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-blue-900">Tren Harga 7 Hari Terakhir</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cabai">Cabai Merah</SelectItem>
                        <SelectItem value="beras">Beras</SelectItem>
                        <SelectItem value="telur">Telur Ayam</SelectItem>
                        <SelectItem value="minyak">Minyak Goreng</SelectItem>
                        <SelectItem value="gula">Gula Pasir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
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
                      <Line 
                        type="monotone" 
                        dataKey={selectedCommodity} 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#1d4ed8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Market Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketData.map((market, index) => (
                <Card key={index} className="shadow-md border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      {market.market}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Pedagang Aktif</span>
                      <span className="font-bold text-green-700">{market.active}/{market.traders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Status</span>
                      <Badge 
                        variant={market.status === "Normal" ? "default" : "secondary"}
                        className={market.status === "Normal" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                      >
                        {market.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fuel">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Fuel className="w-5 h-5 mr-2" />
                  Monitoring LPG & BBM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fitur monitoring distribusi LPG dan BBM akan segera tersedia.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Warehouse className="w-5 h-5 mr-2" />
                  Stock Pangan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Informasi stok pangan strategis akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trade">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Ekspor-Impor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Data aktivitas ekspor-impor akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Perdagangan Lokal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Informasi perdagangan lokal akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrology">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  Metrologi Legal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Data inspeksi metrologi legal akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan Excel
          </Button>
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Unduh Laporan PDF
          </Button>
        </div>
      </div>

      {/* Cultural Pattern Background */}
      <div className="fixed bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-green-600 rounded-tl-full"></div>
      </div>
    </div>
  );
};

export default SimdagDashboard;