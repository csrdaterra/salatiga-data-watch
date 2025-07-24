import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Filter, BarChart3, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCommodities, getMarketCommodities } from "@/stores/commodityStore";
import { getMarkets as getMarketsData } from "@/stores/marketStore";

interface PriceEntry {
  id: number;
  marketId: number;
  commodityId: number;
  price: number;
  date: string;
  operator: string;
  notes?: string;
}

// Generate sample price data for demonstration
const generatePriceData = (): PriceEntry[] => {
  const commodities = getCommodities();
  const markets = getMarketsData();
  const data: PriceEntry[] = [];
  let id = 1;

  markets.forEach(market => {
    commodities.forEach(commodity => {
      // Generate 30 days of price data
      for (let i = 0; i < 30; i++) {
        const basePrice = commodity.category === "beras" ? 12000 :
                         commodity.category === "daging" ? 45000 :
                         commodity.category === "cabai" ? 35000 :
                         commodity.category === "minyak goreng" ? 18000 :
                         commodity.category === "gula pasir" ? 15000 :
                         commodity.category === "tepung terigu" ? 12000 :
                         commodity.category === "bawang" ? 25000 :
                         15000;

        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          id: id++,
          marketId: market.id,
          commodityId: commodity.id,
          price: Math.floor(basePrice + (Math.random() - 0.5) * basePrice * 0.3),
          date: date.toISOString().split('T')[0],
          operator: `Operator ${market.id}`,
          notes: Math.random() > 0.8 ? "Stok terbatas" : undefined
        });
      }
    });
  });

  return data;
};

export const PriceMonitoring = () => {
  const [priceData, setPriceData] = useState<PriceEntry[]>(generatePriceData());
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");
  const [searchTerm, setSearchTerm] = useState("");

  const commodities = getCommodities();
  const markets = getMarketsData();
  const categories = [...new Set(commodities.map(c => c.category))];

  // Filter data based on selections
  const filteredData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(dateRange));

    return priceData.filter(item => {
      const itemDate = new Date(item.date);
      const commodity = commodities.find(c => c.id === item.commodityId);
      const market = markets.find(m => m.id === item.marketId);
      
      const matchesMarket = selectedMarket === "all" || item.marketId.toString() === selectedMarket;
      const matchesCommodity = selectedCommodity === "all" || item.commodityId.toString() === selectedCommodity;
      const matchesCategory = selectedCategory === "all" || commodity?.category === selectedCategory;
      const matchesDate = itemDate >= startDate && itemDate <= endDate;
      const matchesSearch = !searchTerm || 
        commodity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market?.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesMarket && matchesCommodity && matchesCategory && matchesDate && matchesSearch;
    });
  }, [priceData, selectedMarket, selectedCommodity, selectedCategory, dateRange, searchTerm, commodities, markets]);

  // Calculate price analytics
  const priceAnalytics = useMemo(() => {
    const commodityAnalytics = commodities.map(commodity => {
      const commodityPrices = filteredData.filter(item => item.commodityId === commodity.id);
      
      if (commodityPrices.length === 0) {
        return {
          commodity,
          currentPrice: 0,
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0,
          priceChange: 0,
          trend: 'stable' as const
        };
      }

      const prices = commodityPrices.map(item => item.price);
      const latestPrices = commodityPrices
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);
      
      const currentPrice = latestPrices[0]?.price || 0;
      const previousPrice = latestPrices[6]?.price || currentPrice;
      const priceChange = currentPrice - previousPrice;
      
      return {
        commodity,
        currentPrice,
        avgPrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        priceChange,
        trend: priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'stable' as const
      };
    });

    return commodityAnalytics.filter(item => item.currentPrice > 0);
  }, [filteredData, commodities]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (selectedCommodity === "all") return [];

    const commodity = commodities.find(c => c.id.toString() === selectedCommodity);
    if (!commodity) return [];

    const commodityPrices = filteredData
      .filter(item => item.commodityId === commodity.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dailyPrices = commodityPrices.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = { date, prices: [], markets: [] };
      }
      acc[date].prices.push(item.price);
      const market = markets.find(m => m.id === item.marketId);
      if (market) acc[date].markets.push(market.name);
      return acc;
    }, {} as Record<string, { date: string; prices: number[]; markets: string[] }>);

    return Object.values(dailyPrices).map(day => ({
      date: new Date(day.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
      avgPrice: Math.round(day.prices.reduce((sum, price) => sum + price, 0) / day.prices.length),
      minPrice: Math.min(...day.prices),
      maxPrice: Math.max(...day.prices),
      markets: day.markets.join(', ')
    }));
  }, [filteredData, selectedCommodity, commodities, markets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Monitoring Harga Komoditas</h2>
          <p className="text-muted-foreground">Laporan monitoring pergerakan harga barang komoditas di pasar</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>Input Harga Baru</span>
        </Button>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Monitoring
          </CardTitle>
          <CardDescription>
            Filter data monitoring berdasarkan pasar, komoditas, kategori, dan periode waktu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pasar</label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pasar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pasar</SelectItem>
                  {markets.map((market) => (
                    <SelectItem key={market.id} value={market.id.toString()}>{market.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
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
              <label className="text-sm font-medium">Komoditas</label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih komoditas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Komoditas</SelectItem>
                  {commodities
                    .filter(c => selectedCategory === "all" || c.category === selectedCategory)
                    .map((commodity) => (
                    <SelectItem key={commodity.id} value={commodity.id.toString()}>{commodity.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Periode</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari Terakhir</SelectItem>
                  <SelectItem value="14">14 Hari Terakhir</SelectItem>
                  <SelectItem value="30">30 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Pencarian</label>
              <Input
                placeholder="Cari komoditas atau pasar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Komoditas</p>
                <p className="text-2xl font-bold">{priceAnalytics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harga Naik</p>
                <p className="text-2xl font-bold text-green-500">
                  {priceAnalytics.filter(item => item.trend === 'up').length}
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
                <p className="text-sm font-medium text-muted-foreground">Harga Turun</p>
                <p className="text-2xl font-bold text-red-500">
                  {priceAnalytics.filter(item => item.trend === 'down').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stabil</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {priceAnalytics.filter(item => item.trend === 'stable').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analitik Harga</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Tren Pergerakan</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Data Harga</span>
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analitik dan Statistik Harga</CardTitle>
              <CardDescription>
                Statistik harga komoditas berdasarkan filter yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga Saat Ini</TableHead>
                      <TableHead>Harga Rata-rata</TableHead>
                      <TableHead>Harga Terendah</TableHead>
                      <TableHead>Harga Tertinggi</TableHead>
                      <TableHead>Perubahan</TableHead>
                      <TableHead>Tren</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceAnalytics.map((item) => (
                      <TableRow key={item.commodity.id}>
                        <TableCell className="font-medium">{item.commodity.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{item.commodity.category}</Badge>
                        </TableCell>
                        <TableCell>Rp {item.currentPrice.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.avgPrice.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.minPrice.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.maxPrice.toLocaleString('id-ID')}</TableCell>
                        <TableCell className={item.priceChange >= 0 ? "text-green-600" : "text-red-600"}>
                          {item.priceChange >= 0 ? "+" : ""}Rp {item.priceChange.toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}
                            className="flex items-center space-x-1 w-fit"
                          >
                            {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                            {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                            <span className="capitalize">{item.trend === 'up' ? 'Naik' : item.trend === 'down' ? 'Turun' : 'Stabil'}</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Pergerakan Harga</CardTitle>
              <CardDescription>
                {selectedCommodity === "all" 
                  ? "Pilih komoditas spesifik untuk melihat grafik pergerakan harga" 
                  : `Pergerakan harga ${commodities.find(c => c.id.toString() === selectedCommodity)?.name || ''} dalam ${dateRange} hari terakhir`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCommodity === "all" ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Pilih komoditas spesifik untuk melihat grafik
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                      <Tooltip 
                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Harga']}
                        labelFormatter={(label) => `Tanggal: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgPrice" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Harga Rata-rata"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="minPrice" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Harga Terendah"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="maxPrice" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Harga Tertinggi"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Harga Mentah</CardTitle>
              <CardDescription>
                Menampilkan {filteredData.length} entri data harga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pasar</TableHead>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice(0, 50).map((item) => {
                      const commodity = commodities.find(c => c.id === item.commodityId);
                      const market = markets.find(m => m.id === item.marketId);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>{market?.name || 'Unknown'}</TableCell>
                          <TableCell>{commodity?.name || 'Unknown'}</TableCell>
                          <TableCell className="font-medium">Rp {item.price.toLocaleString('id-ID')}</TableCell>
                          <TableCell>{item.operator}</TableCell>
                          <TableCell>{item.notes || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredData.length > 50 && (
                <div className="mt-4 text-center text-muted-foreground">
                  Menampilkan 50 dari {filteredData.length} data. Gunakan filter untuk mempersempit hasil.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};