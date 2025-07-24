import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, BarChart3, Calendar, MapPin, 
  DollarSign, Package, Activity, AlertTriangle, CheckCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SurveyData {
  id: string;
  market_id: number;
  commodity_id: number;
  price: number;
  stock_status: string;
  quality: string;
  survey_date: string;
  operator_name: string;
  created_at: string;
}

interface Market {
  id: number;
  name: string;
  address: string;
}

interface PriceStatistics {
  commodity_id: number;
  commodity_name: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  price_trend: number;
  survey_count: number;
  last_price: number;
  last_survey_date: string;
}

interface DailyTrend {
  date: string;
  avg_price: number;
  survey_count: number;
  available_count: number;
  limited_count: number;
  unavailable_count: number;
}

// Daftar 50 item Kepokmas
const kepokmasItems = [
  { id: 1, name: "Beras Premium", unit: "kg" },
  { id: 2, name: "Beras Medium", unit: "kg" },
  { id: 3, name: "Beras IR 64", unit: "kg" },
  { id: 4, name: "Gula Pasir", unit: "kg" },
  { id: 5, name: "Gula Merah", unit: "kg" },
  { id: 6, name: "Minyak Goreng Kemasan", unit: "liter" },
  { id: 7, name: "Minyak Goreng Curah", unit: "liter" },
  { id: 8, name: "Minyak Kelapa Sawit", unit: "liter" },
  { id: 9, name: "Tepung Terigu Protein Tinggi", unit: "kg" },
  { id: 10, name: "Tepung Terigu Protein Sedang", unit: "kg" },
  { id: 11, name: "Daging Sapi Murni", unit: "kg" },
  { id: 12, name: "Daging Sapi Has Dalam", unit: "kg" },
  { id: 13, name: "Daging Ayam Ras", unit: "kg" },
  { id: 14, name: "Daging Ayam Kampung", unit: "kg" },
  { id: 15, name: "Telur Ayam Ras", unit: "kg" },
  { id: 16, name: "Telur Ayam Kampung", unit: "kg" },
  { id: 17, name: "Ikan Bandeng", unit: "kg" },
  { id: 18, name: "Ikan Tongkol", unit: "kg" },
  { id: 19, name: "Ikan Teri", unit: "kg" },
  { id: 20, name: "Ikan Kembung", unit: "kg" },
  { id: 21, name: "Cabai Merah Besar", unit: "kg" },
  { id: 22, name: "Cabai Merah Keriting", unit: "kg" },
  { id: 23, name: "Cabai Rawit Merah", unit: "kg" },
  { id: 24, name: "Cabai Rawit Hijau", unit: "kg" },
  { id: 25, name: "Bawang Merah", unit: "kg" },
  { id: 26, name: "Bawang Putih", unit: "kg" },
  { id: 27, name: "Bawang Bombay", unit: "kg" },
  { id: 28, name: "Tomat", unit: "kg" },
  { id: 29, name: "Kentang", unit: "kg" },
  { id: 30, name: "Wortel", unit: "kg" },
  { id: 31, name: "Kol/Kubis", unit: "kg" },
  { id: 32, name: "Sawi Hijau", unit: "kg" },
  { id: 33, name: "Kangkung", unit: "ikat" },
  { id: 34, name: "Bayam", unit: "ikat" },
  { id: 35, name: "Kacang Panjang", unit: "kg" },
  { id: 36, name: "Kacang Tanah", unit: "kg" },
  { id: 37, name: "Kedelai", unit: "kg" },
  { id: 38, name: "Tahu", unit: "potong" },
  { id: 39, name: "Tempe", unit: "potong" },
  { id: 40, name: "Susu Kental Manis", unit: "kaleng" },
  { id: 41, name: "Susu Bubuk", unit: "kotak" },
  { id: 42, name: "Mentega", unit: "kg" },
  { id: 43, name: "Garam", unit: "kg" },
  { id: 44, name: "Merica", unit: "kg" },
  { id: 45, name: "Kecap Manis", unit: "botol" },
  { id: 46, name: "Kecap Asin", unit: "botol" },
  { id: 47, name: "Saus Tomat", unit: "botol" },
  { id: 48, name: "Mie Instan", unit: "bungkus" },
  { id: 49, name: "Roti Tawar", unit: "bungkus" },
  { id: 50, name: "Kerupuk", unit: "kg" }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const KepokmasAnalytics = () => {
  const { toast } = useToast();
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7");
  const [isLoading, setIsLoading] = useState(true);
  const [priceStatistics, setPriceStatistics] = useState<PriceStatistics[]>([]);
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);

  // Fetch markets
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data, error } = await supabase
          .from('markets')
          .select('id, name, address')
          .eq('city', 'Salatiga')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setMarkets(data || []);
      } catch (error: any) {
        console.error('Error fetching markets:', error);
      }
    };

    fetchMarkets();
  }, []);

  // Fetch survey data
  useEffect(() => {
    const fetchSurveyData = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('price_surveys')
          .select('*')
          .gte('survey_date', new Date(Date.now() - parseInt(selectedPeriod) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('survey_date', { ascending: false });

        if (selectedMarket !== "all") {
          query = query.eq('market_id', parseInt(selectedMarket));
        }

        const { data, error } = await query;

        if (error) throw error;
        setSurveyData(data || []);
        
        // Process statistics
        processStatistics(data || []);
        processDailyTrends(data || []);
        
      } catch (error: any) {
        console.error('Error fetching survey data:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data survey",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [selectedMarket, selectedPeriod]);

  const processStatistics = (data: SurveyData[]) => {
    const stats: { [key: number]: any } = {};
    
    data.forEach(survey => {
      if (!stats[survey.commodity_id]) {
        stats[survey.commodity_id] = {
          prices: [],
          dates: [],
          count: 0
        };
      }
      
      stats[survey.commodity_id].prices.push(survey.price);
      stats[survey.commodity_id].dates.push(survey.survey_date);
      stats[survey.commodity_id].count++;
    });

    const processedStats: PriceStatistics[] = Object.entries(stats).map(([commodityId, stat]) => {
      const prices = stat.prices.sort((a: number, b: number) => a - b);
      const dates = stat.dates.sort();
      const commodity = kepokmasItems.find(item => item.id === parseInt(commodityId));
      
      // Calculate trend (simple: compare first and last price)
      const firstPrice = prices[0];
      const lastPrice = prices[prices.length - 1];
      const trend = prices.length > 1 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

      return {
        commodity_id: parseInt(commodityId),
        commodity_name: commodity?.name || `Komoditas ${commodityId}`,
        avg_price: prices.reduce((a: number, b: number) => a + b, 0) / prices.length,
        min_price: Math.min(...prices),
        max_price: Math.max(...prices),
        price_trend: trend,
        survey_count: stat.count,
        last_price: lastPrice,
        last_survey_date: dates[dates.length - 1]
      };
    });

    setPriceStatistics(processedStats.sort((a, b) => a.commodity_name.localeCompare(b.commodity_name)));
  };

  const processDailyTrends = (data: SurveyData[]) => {
    const dailyData: { [key: string]: any } = {};

    data.forEach(survey => {
      const date = survey.survey_date;
      if (!dailyData[date]) {
        dailyData[date] = {
          prices: [],
          available: 0,
          limited: 0,
          unavailable: 0,
          total: 0
        };
      }

      dailyData[date].prices.push(survey.price);
      dailyData[date].total++;
      
      if (survey.stock_status === 'available') dailyData[date].available++;
      else if (survey.stock_status === 'limited') dailyData[date].limited++;
      else if (survey.stock_status === 'unavailable') dailyData[date].unavailable++;
    });

    const trends: DailyTrend[] = Object.entries(dailyData).map(([date, data]) => ({
      date,
      avg_price: data.prices.reduce((a: number, b: number) => a + b, 0) / data.prices.length,
      survey_count: data.total,
      available_count: data.available,
      limited_count: data.limited,
      unavailable_count: data.unavailable
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setDailyTrends(trends);
  };

  const getOverallStats = () => {
    const totalSurveys = surveyData.length;
    const uniqueCommodities = new Set(surveyData.map(s => s.commodity_id)).size;
    const avgPrice = surveyData.length > 0 
      ? surveyData.reduce((sum, s) => sum + s.price, 0) / surveyData.length 
      : 0;
    
    const stockCounts = surveyData.reduce((acc, s) => {
      acc[s.stock_status] = (acc[s.stock_status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalSurveys,
      uniqueCommodities,
      avgPrice,
      stockCounts
    };
  };

  const stats = getOverallStats();

  // Stock status distribution for pie chart
  const stockDistribution = Object.entries(stats.stockCounts).map(([status, count]) => ({
    name: status === 'available' ? 'Tersedia' : status === 'limited' ? 'Terbatas' : 'Habis',
    value: count,
    status
  }));

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Memuat data analitik...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analitik Kepokmas</h1>
          <p className="text-muted-foreground">Analisis harga dan ketersediaan 50 komoditas kepokmas</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih pasar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pasar</SelectItem>
              {markets.map((market) => (
                <SelectItem key={market.id} value={market.id.toString()}>
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Hari Terakhir</SelectItem>
              <SelectItem value="14">14 Hari Terakhir</SelectItem>
              <SelectItem value="30">30 Hari Terakhir</SelectItem>
              <SelectItem value="90">90 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Survey</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSurveys}</div>
            <p className="text-xs text-muted-foreground">Data survey terkumpul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Komoditas Terdata</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCommodities}</div>
            <p className="text-xs text-muted-foreground">dari 50 item kepokmas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Harga</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {stats.avgPrice.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Semua komoditas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Ketersediaan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((stats.stockCounts.available || 0) / stats.totalSurveys * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Tersedia</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tren Harian</TabsTrigger>
          <TabsTrigger value="commodities">Statistik Komoditas</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi Stok</TabsTrigger>
          <TabsTrigger value="comparison">Perbandingan Harga</TabsTrigger>
        </TabsList>

        {/* Daily Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tren Harga Harian</CardTitle>
              <CardDescription>
                Perkembangan rata-rata harga komoditas per hari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                    />
                    <YAxis 
                      tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                      formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Rata-rata Harga']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avg_price" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commodity Statistics */}
        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Per Komoditas</CardTitle>
              <CardDescription>
                Analisis harga minimum, maksimum, rata-rata, dan tren per komoditas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceStatistics.slice(0, 20).map((stat) => (
                  <div key={stat.commodity_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{stat.commodity_name}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Min: Rp {stat.min_price.toLocaleString('id-ID')}</span>
                        <span>Max: Rp {stat.max_price.toLocaleString('id-ID')}</span>
                        <span>Avg: Rp {stat.avg_price.toLocaleString('id-ID')}</span>
                        <span>{stat.survey_count} survey</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={stat.price_trend > 0 ? "destructive" : stat.price_trend < 0 ? "default" : "secondary"}>
                        {stat.price_trend > 0 ? (
                          <><TrendingUp className="w-3 h-3 mr-1" />+{stat.price_trend.toFixed(1)}%</>
                        ) : stat.price_trend < 0 ? (
                          <><TrendingDown className="w-3 h-3 mr-1" />{stat.price_trend.toFixed(1)}%</>
                        ) : (
                          <>Stabil</>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Distribution */}
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status Stok</CardTitle>
                <CardDescription>
                  Persentase ketersediaan komoditas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stockDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tren Ketersediaan Harian</CardTitle>
                <CardDescription>
                  Jumlah komoditas berdasarkan status per hari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                      />
                      <Legend />
                      <Bar dataKey="available_count" stackId="a" fill="#00C49F" name="Tersedia" />
                      <Bar dataKey="limited_count" stackId="a" fill="#FFBB28" name="Terbatas" />
                      <Bar dataKey="unavailable_count" stackId="a" fill="#FF8042" name="Habis" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Price Comparison */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Harga Top 10 Komoditas</CardTitle>
              <CardDescription>
                Komoditas dengan survey terbanyak dan perbandingan harganya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={priceStatistics
                      .sort((a, b) => b.survey_count - a.survey_count)
                      .slice(0, 10)
                    }
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number"
                      tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                    />
                    <YAxis 
                      type="category"
                      dataKey="commodity_name" 
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Rata-rata Harga']}
                    />
                    <Bar dataKey="avg_price" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KepokmasAnalytics;