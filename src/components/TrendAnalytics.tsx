import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Wheat, Apple, Egg, Droplets } from 'lucide-react';

// Mock data for price trends
const priceData = [
  { date: '2024-01-15', beras: 12000, cabai: 25000, telur: 24000, minyak: 17000, gula: 14000, daging: 120000 },
  { date: '2024-01-16', beras: 12100, cabai: 26000, telur: 24500, minyak: 17200, gula: 14200, daging: 122000 },
  { date: '2024-01-17', beras: 12200, cabai: 27000, telur: 25000, minyak: 17500, gula: 14100, daging: 121000 },
  { date: '2024-01-18', beras: 12150, cabai: 26500, telur: 24800, minyak: 17300, gula: 14300, daging: 123000 },
  { date: '2024-01-19', beras: 12300, cabai: 28000, telur: 25200, minyak: 17800, gula: 14500, daging: 125000 },
  { date: '2024-01-20', beras: 12250, cabai: 27500, telur: 25000, minyak: 17600, gula: 14400, daging: 124000 },
  { date: '2024-01-21', beras: 12400, cabai: 29000, telur: 25500, minyak: 18000, gula: 14600, daging: 126000 },
];

const weeklyData = [
  { week: 'Minggu 1', beras: 12050, cabai: 25500, telur: 24200, minyak: 17100 },
  { week: 'Minggu 2', beras: 12150, cabai: 26200, telur: 24600, minyak: 17400 },
  { week: 'Minggu 3', beras: 12250, cabai: 27100, telur: 25100, minyak: 17700 },
  { week: 'Minggu 4', beras: 12350, cabai: 28000, telur: 25400, minyak: 18000 },
];

const categoryData = [
  { name: 'Bahan Pokok', value: 45, color: '#2563eb' },
  { name: 'Protein', value: 25, color: '#059669' },
  { name: 'Sayuran', value: 20, color: '#dc2626' },
  { name: 'Bumbu Dapur', value: 10, color: '#d97706' },
];

const commodityStats = [
  { 
    name: 'Beras', 
    price: 'Rp 12.400', 
    change: '+2.9%', 
    trend: 'up', 
    icon: Wheat,
    category: 'Bahan Pokok',
    status: 'Stabil'
  },
  { 
    name: 'Cabai Merah', 
    price: 'Rp 29.000', 
    change: '+16.7%', 
    trend: 'up', 
    icon: Apple,
    category: 'Sayuran',
    status: 'Naik'
  },
  { 
    name: 'Telur Ayam', 
    price: 'Rp 25.500', 
    change: '+5.4%', 
    trend: 'up', 
    icon: Egg,
    category: 'Protein',
    status: 'Stabil'
  },
  { 
    name: 'Minyak Goreng', 
    price: 'Rp 18.000', 
    change: '+5.9%', 
    trend: 'up', 
    icon: Droplets,
    category: 'Bahan Pokok',
    status: 'Naik'
  },
  { 
    name: 'Gula Pasir', 
    price: 'Rp 14.600', 
    change: '+4.3%', 
    trend: 'up', 
    icon: Wheat,
    category: 'Bahan Pokok',
    status: 'Stabil'
  },
  { 
    name: 'Daging Sapi', 
    price: 'Rp 126.000', 
    change: '+5.0%', 
    trend: 'up', 
    icon: Apple,
    category: 'Protein',
    status: 'Naik'
  },
];

const TrendAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Analisis Tren Komoditas</h2>
        <p className="text-lg text-muted-foreground">
          Monitoring pergerakan harga bahan pokok dan komoditas strategis
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {commodityStats.map((item, index) => (
          <Card key={index} className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <Badge 
                    variant="secondary"
                    className={
                      item.status === 'Stabil' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Naik' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{item.name}</h3>
                  <p className="text-lg font-bold text-foreground">{item.price}</p>
                  <div className="flex items-center space-x-1">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-red-600" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 text-green-600" />
                    ) : (
                      <Minus className="w-3 h-3 text-gray-600" />
                    )}
                    <span className={`text-xs ${
                      item.trend === 'up' ? 'text-red-600' :
                      item.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Tren Harian</TabsTrigger>
          <TabsTrigger value="weekly">Perbandingan Mingguan</TabsTrigger>
          <TabsTrigger value="category">Kategori Komoditas</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Pergerakan Harga Harian (7 Hari Terakhir)</CardTitle>
              <CardDescription>
                Tren harga komoditas utama dalam rupiah per kilogram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                    <Line type="monotone" dataKey="cabai" stroke="#dc2626" strokeWidth={2} name="Cabai Merah" />
                    <Line type="monotone" dataKey="telur" stroke="#059669" strokeWidth={2} name="Telur" />
                    <Line type="monotone" dataKey="minyak" stroke="#d97706" strokeWidth={2} name="Minyak Goreng" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Perbandingan Harga Mingguan</CardTitle>
              <CardDescription>
                Rata-rata harga per minggu dalam bulan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Rata-rata Harga']}
                    />
                    <Bar dataKey="beras" fill="#2563eb" name="Beras" />
                    <Bar dataKey="cabai" fill="#dc2626" name="Cabai Merah" />
                    <Bar dataKey="telur" fill="#059669" name="Telur" />
                    <Bar dataKey="minyak" fill="#d97706" name="Minyak Goreng" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Distribusi Kategori Komoditas</CardTitle>
                <CardDescription>
                  Persentase komoditas berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Status Komoditas</CardTitle>
                <CardDescription>
                  Ringkasan status harga komoditas strategis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-green-700">Stabil</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">3</div>
                      <div className="text-sm text-red-700">Naik</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">0</div>
                      <div className="text-sm text-gray-700">Turun</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Komoditas Perlu Perhatian:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Cabai Merah: Kenaikan signifikan (+16.7%)</li>
                      <li>• Minyak Goreng: Trend naik berkelanjutan</li>
                      <li>• Daging Sapi: Harga di atas rata-rata</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendAnalytics;