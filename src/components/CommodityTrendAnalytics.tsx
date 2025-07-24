import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCommodities } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";

interface TrendData {
  date: string;
  prices: { [commodityId: number]: number };
  avgPrice: number;
}

interface CommodityAnalytics {
  commodityId: number;
  name: string;
  category: string;
  currentPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChange: number;
  volatility: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

// Generate sample trend data
const generateTrendData = (days: number): TrendData[] => {
  const commodities = getCommodities();
  const data: TrendData[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const prices: { [commodityId: number]: number } = {};
    let totalPrice = 0;
    
    commodities.forEach(commodity => {
      const basePrice = commodity.category === "beras" ? 12000 :
                       commodity.category === "daging" ? 45000 :
                       commodity.category === "cabai" ? 35000 :
                       commodity.category === "minyak goreng" ? 18000 :
                       commodity.category === "gula pasir" ? 15000 :
                       commodity.category === "tepung terigu" ? 12000 :
                       commodity.category === "bawang" ? 25000 :
                       15000;
      
      // Add seasonal and trend variations
      const seasonalFactor = 1 + 0.1 * Math.sin((i / days) * 2 * Math.PI);
      const trendFactor = 1 + (i / days) * 0.2 * (Math.random() - 0.5);
      const dailyVariation = 1 + 0.05 * (Math.random() - 0.5);
      
      const price = Math.floor(basePrice * seasonalFactor * trendFactor * dailyVariation);
      prices[commodity.id] = price;
      totalPrice += price;
    });
    
    data.push({
      date: date.toISOString().split('T')[0],
      prices,
      avgPrice: Math.floor(totalPrice / commodities.length)
    });
  }
  
  return data;
};

export const CommodityTrendAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("trend");

  const commodities = getCommodities();
  const markets = getMarkets();
  const categories = [...new Set(commodities.map(c => c.category))];

  const trendData = useMemo(() => generateTrendData(parseInt(selectedPeriod)), [selectedPeriod]);

  const commodityAnalytics = useMemo((): CommodityAnalytics[] => {
    return commodities
      .filter(commodity => selectedCategory === "all" || commodity.category === selectedCategory)
      .map(commodity => {
        const prices = trendData.map(d => d.prices[commodity.id]).filter(Boolean);
        
        if (prices.length === 0) {
          return {
            commodityId: commodity.id,
            name: commodity.name,
            category: commodity.category,
            currentPrice: 0,
            avgPrice: 0,
            minPrice: 0,
            maxPrice: 0,
            priceChange: 0,
            volatility: 0,
            trend: 'stable' as const,
            recommendation: 'Data tidak tersedia'
          };
        }

        const currentPrice = prices[prices.length - 1];
        const previousPrice = prices[Math.max(0, prices.length - 8)]; // 7 days ago
        const avgPrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceChange = currentPrice - previousPrice;
        
        // Calculate volatility (standard deviation)
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;
        const volatility = Math.sqrt(variance);
        
        const trend: 'up' | 'down' | 'stable' = priceChange > avgPrice * 0.02 ? 'up' : 
                     priceChange < -avgPrice * 0.02 ? 'down' : 'stable';
        
        let recommendation = "";
        if (trend === 'up' && volatility > avgPrice * 0.1) {
          recommendation = "Harga naik tinggi, perlu monitoring";
        } else if (trend === 'down' && volatility > avgPrice * 0.1) {
          recommendation = "Harga turun signifikan, stok mungkin berlebih";
        } else if (volatility > avgPrice * 0.15) {
          recommendation = "Volatilitas tinggi, harga tidak stabil";
        } else {
          recommendation = "Harga stabil, kondisi normal";
        }

        return {
          commodityId: commodity.id,
          name: commodity.name,
          category: commodity.category,
          currentPrice,
          avgPrice,
          minPrice,
          maxPrice,
          priceChange,
          volatility,
          trend,
          recommendation
        };
      })
      .filter(item => item.currentPrice > 0);
  }, [trendData, commodities, selectedCategory]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return trendData.slice(-14).map(item => ({
      date: new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
      avgPrice: item.avgPrice,
      ...commodityAnalytics.reduce((acc, commodity) => {
        acc[commodity.name.substring(0, 15)] = item.prices[commodity.commodityId] || 0;
        return acc;
      }, {} as Record<string, number>)
    }));
  }, [trendData, commodityAnalytics]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const distribution = categories.map(category => {
      const categoryItems = commodityAnalytics.filter(item => item.category === category);
      const avgPrice = categoryItems.length > 0 
        ? Math.round(categoryItems.reduce((sum, item) => sum + item.currentPrice, 0) / categoryItems.length)
        : 0;
      
      return {
        name: category,
        value: avgPrice,
        count: categoryItems.length
      };
    }).filter(item => item.value > 0);

    return distribution;
  }, [commodityAnalytics, categories]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analitik Tren Komoditas</h2>
          <p className="text-muted-foreground">Analisis pergerakan harga dan tren komoditas periode tertentu</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {parseInt(selectedPeriod)} hari terakhir
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Analisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Periode Analisis</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari</SelectItem>
                  <SelectItem value="14">14 Hari</SelectItem>
                  <SelectItem value="30">30 Hari</SelectItem>
                  <SelectItem value="60">60 Hari</SelectItem>
                  <SelectItem value="90">90 Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori Komoditas</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Analisis</label>
              <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih analisis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend">Analisis Tren</SelectItem>
                  <SelectItem value="volatility">Analisis Volatilitas</SelectItem>
                  <SelectItem value="distribution">Distribusi Kategori</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Komoditas</p>
                <p className="text-2xl font-bold">{commodityAnalytics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tren Naik</p>
                <p className="text-2xl font-bold text-green-500">
                  {commodityAnalytics.filter(item => item.trend === 'up').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tren Turun</p>
                <p className="text-2xl font-bold text-red-500">
                  {commodityAnalytics.filter(item => item.trend === 'down').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volatilitas Tinggi</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {commodityAnalytics.filter(item => item.volatility > item.avgPrice * 0.15).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Harga Rata-rata</CardTitle>
            <CardDescription>
              Pergerakan harga rata-rata komoditas dalam {selectedPeriod} hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Harga']}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgPrice" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Harga Rata-rata"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Harga per Kategori</CardTitle>
            <CardDescription>
              Rata-rata harga komoditas berdasarkan kategori
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
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Rata-rata Harga']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Analisis Komoditas</CardTitle>
          <CardDescription>
            Rekomendasi berdasarkan analisis tren dan volatilitas harga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Komoditas</th>
                  <th className="text-left p-2 font-medium">Kategori</th>
                  <th className="text-left p-2 font-medium">Harga Saat Ini</th>
                  <th className="text-left p-2 font-medium">Perubahan</th>
                  <th className="text-left p-2 font-medium">Volatilitas</th>
                  <th className="text-left p-2 font-medium">Tren</th>
                  <th className="text-left p-2 font-medium">Rekomendasi</th>
                </tr>
              </thead>
              <tbody>
                {commodityAnalytics.slice(0, 10).map((item) => (
                  <tr key={item.commodityId} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="capitalize">{item.category}</Badge>
                    </td>
                    <td className="p-2">Rp {item.currentPrice.toLocaleString('id-ID')}</td>
                    <td className={`p-2 ${item.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.priceChange >= 0 ? "+" : ""}Rp {item.priceChange.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant={item.volatility > item.avgPrice * 0.15 ? "destructive" : "secondary"}
                      >
                        {((item.volatility / item.avgPrice) * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}
                        className="flex items-center space-x-1 w-fit"
                      >
                        {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        <span className="capitalize">
                          {item.trend === 'up' ? 'Naik' : item.trend === 'down' ? 'Turun' : 'Stabil'}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-muted-foreground max-w-[200px]">
                      {item.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {commodityAnalytics.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                Lihat Semua ({commodityAnalytics.length} komoditas)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};