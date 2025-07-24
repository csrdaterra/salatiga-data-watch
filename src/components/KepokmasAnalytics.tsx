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
  DollarSign, Package, Activity, AlertTriangle, CheckCircle, Building2 
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

interface StockBapoktingData {
  id: string;
  survey_date: string;
  commodity_id: number;
  store_name: string;
  january_capaian: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  operator_name: string;
  created_at: string;
}

interface WeeklyComparisonData {
  commodity_name: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

interface LargeStoreStockTrend {
  date: string;
  totalStock: number;
  averageStock: number;
  storeCount: number;
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
  const [stockBapoktingData, setStockBapoktingData] = useState<StockBapoktingData[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<WeeklyComparisonData[]>([]);
  const [largeStoreStockTrends, setLargeStoreStockTrends] = useState<LargeStoreStockTrend[]>([]);

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
        processWeeklyComparison(data || []);
        
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

  // Fetch stock bapokting data for large stores analysis
  useEffect(() => {
    const fetchStockBapoktingData = async () => {
      try {
        const { data, error } = await supabase
          .from('stock_bapokting')
          .select('*')
          .gte('survey_date', new Date(Date.now() - parseInt(selectedPeriod) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('survey_date', { ascending: false });

        if (error) throw error;
        setStockBapoktingData(data || []);
        processLargeStoreStockTrends(data || []);
        
      } catch (error: any) {
        console.error('Error fetching stock bapokting data:', error);
      }
    };

    fetchStockBapoktingData();
  }, [selectedPeriod]);

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

  const processWeeklyComparison = (data: SurveyData[]) => {
    // Get data from last 14 days to compare 2 weeks
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    // Filter data by markets (take first 3 markets for comparison)
    const selectedMarkets = markets.slice(0, 3).map(m => m.id);
    const filteredData = data.filter(survey => 
      selectedMarkets.includes(survey.market_id) &&
      new Date(survey.survey_date) >= twoWeeksAgo
    );

    // Group by commodity and week
    const commodityWeeklyData: { [key: number]: { thisWeek: number[], lastWeek: number[] } } = {};

    filteredData.forEach(survey => {
      const surveyDate = new Date(survey.survey_date);
      if (!commodityWeeklyData[survey.commodity_id]) {
        commodityWeeklyData[survey.commodity_id] = { thisWeek: [], lastWeek: [] };
      }

      if (surveyDate >= oneWeekAgo && surveyDate <= now) {
        commodityWeeklyData[survey.commodity_id].thisWeek.push(survey.price);
      } else if (surveyDate >= twoWeeksAgo && surveyDate < oneWeekAgo) {
        commodityWeeklyData[survey.commodity_id].lastWeek.push(survey.price);
      }
    });

    const weeklyComparisonData: WeeklyComparisonData[] = Object.entries(commodityWeeklyData)
      .filter(([_, data]) => data.thisWeek.length > 0 && data.lastWeek.length > 0)
      .map(([commodityId, data]) => {
        const commodity = kepokmasItems.find(item => item.id === parseInt(commodityId));
        const thisWeekSum = data.thisWeek.reduce((sum, price) => sum + price, 0);
        const lastWeekSum = data.lastWeek.reduce((sum, price) => sum + price, 0);
        const change = thisWeekSum - lastWeekSum;
        const changePercent = lastWeekSum > 0 ? (change / lastWeekSum) * 100 : 0;

        return {
          commodity_name: commodity?.name || `Komoditas ${commodityId}`,
          thisWeek: thisWeekSum,
          lastWeek: lastWeekSum,
          change,
          changePercent,
          trend: (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') as 'up' | 'down' | 'stable'
        };
      })
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 15);

    setWeeklyComparison(weeklyComparisonData);
  };

  const processLargeStoreStockTrends = (data: StockBapoktingData[]) => {
    const dailyStockData: { [key: string]: { totalStock: number, storeCount: number } } = {};
    
    data.forEach(stock => {
      const date = stock.survey_date;
      if (!dailyStockData[date]) {
        dailyStockData[date] = { totalStock: 0, storeCount: 0 };
      }

      // Sum all monthly stock data
      const monthlyTotal = stock.january_capaian + stock.february + stock.march + 
                          stock.april + stock.may + stock.june + stock.july + 
                          stock.august + stock.september + stock.october + 
                          stock.november + stock.december;

      dailyStockData[date].totalStock += monthlyTotal;
      dailyStockData[date].storeCount++;
    });

    const trends: LargeStoreStockTrend[] = Object.entries(dailyStockData)
      .map(([date, data]) => ({
        date,
        totalStock: data.totalStock,
        averageStock: data.storeCount > 0 ? data.totalStock / data.storeCount : 0,
        storeCount: data.storeCount
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setLargeStoreStockTrends(trends);
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
      <Tabs defaultValue="stock-trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stock-trends">Stok Toko Besar</TabsTrigger>
          <TabsTrigger value="commodities">Statistik Komoditas</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi Stok</TabsTrigger>
          <TabsTrigger value="weekly-comparison">Perbandingan Mingguan</TabsTrigger>
        </TabsList>

        {/* Large Store Stock Trends */}
        <TabsContent value="stock-trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Analisis Stok Pangan dari Toko Besar per 7 Hari
              </CardTitle>
              <CardDescription>
                Analisis perkembangan stok pangan dari toko besar dan distributor berdasarkan data Bapokting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stock Trend Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={largeStoreStockTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                        formatter={(value: any, name: string) => [
                          name === 'totalStock' ? `${value.toLocaleString('id-ID')} unit` : 
                          name === 'averageStock' ? `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} unit` :
                          `${value} toko`,
                          name === 'totalStock' ? 'Total Stok' : 
                          name === 'averageStock' ? 'Rata-rata Stok per Toko' : 'Jumlah Toko'
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalStock" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        name="Total Stok"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="averageStock" 
                        stroke="#82ca9d" 
                        strokeWidth={3}
                        name="Rata-rata Stok per Toko"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Stok Terkini</p>
                          <p className="text-2xl font-bold">
                            {largeStoreStockTrends.length > 0 
                              ? largeStoreStockTrends[largeStoreStockTrends.length - 1]?.totalStock.toLocaleString('id-ID')
                              : '0'
                            } unit
                          </p>
                        </div>
                        <Package className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Rata-rata per Toko</p>
                          <p className="text-2xl font-bold">
                            {largeStoreStockTrends.length > 0 
                              ? largeStoreStockTrends[largeStoreStockTrends.length - 1]?.averageStock.toLocaleString('id-ID', { maximumFractionDigits: 1 })
                              : '0'
                            } unit
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Toko Pelapor</p>
                          <p className="text-2xl font-bold">
                            {largeStoreStockTrends.length > 0 
                              ? largeStoreStockTrends[largeStoreStockTrends.length - 1]?.storeCount || 0
                              : '0'
                            } toko
                          </p>
                        </div>
                        <Building2 className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
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

        {/* Weekly Comparison */}
        <TabsContent value="weekly-comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Analisis Perbandingan Mingguan
              </CardTitle>
              <CardDescription>
                Perbandingan mingguan dari total penjumlahan harga 3 pasar untuk 50 komoditas kepokmas setiap minggu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyComparison.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weeklyComparison.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{item.commodity_name}</h4>
                          <Badge 
                            variant={item.trend === 'up' ? 'destructive' : item.trend === 'down' ? 'default' : 'secondary'}
                            className="flex items-center space-x-1"
                          >
                            {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                            {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                            <span>{item.changePercent.toFixed(1)}%</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Minggu Ini:</span>
                            <span className="font-medium">Rp {item.thisWeek.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Minggu Lalu:</span>
                            <span className="font-medium">Rp {item.lastWeek.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Perubahan:</span>
                            <span className={`font-medium ${item.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.change >= 0 ? '+' : ''}Rp {item.change.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          {item.trend === 'up' && Math.abs(item.changePercent) > 10 
                            ? "⚠️ Kenaikan signifikan, perlu monitoring"
                            : item.trend === 'down' && Math.abs(item.changePercent) > 10
                            ? "📉 Penurunan signifikan, harga lebih terjangkau"
                            : "✅ Pergerakan normal dalam batas wajar"
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Tidak ada data perbandingan mingguan tersedia</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Data memerlukan survey dari minimal 3 pasar untuk periode 2 minggu
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KepokmasAnalytics;