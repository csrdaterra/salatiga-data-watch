import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ArrowLeft, MapPin, DollarSign, TrendingUp, TrendingDown, 
  Package, AlertTriangle, CheckCircle, Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Market {
  id: number;
  name: string;
  address: string;
  contact?: string;
}

interface SurveyData {
  id: string;
  commodity_id: number;
  price: number;
  stock_status: string;
  quality: string;
  survey_date: string;
  operator_name: string;
}

interface CommodityAnalytics {
  commodity_id: number;
  commodity_name: string;
  unit: string;
  latest_price: number;
  avg_price_7d: number;
  price_trend: number;
  stock_status: string;
  quality: string;
  survey_count: number;
  last_survey_date: string;
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

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const MarketDetailPage = () => {
  const { marketId } = useParams();
  const { toast } = useToast();
  const [market, setMarket] = useState<Market | null>(null);
  const [commodityAnalytics, setCommodityAnalytics] = useState<CommodityAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    if (marketId) {
      fetchMarketData();
      fetchCommodityAnalytics();
    }
  }, [marketId]);

  const fetchMarketData = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('id', parseInt(marketId!))
        .single();

      if (error) throw error;
      setMarket(data);
    } catch (error: any) {
      console.error('Error fetching market:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pasar",
        variant: "destructive",
      });
    }
  };

  const fetchCommodityAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch recent survey data for this market
      const { data: surveyData, error } = await supabase
        .from('price_surveys')
        .select('*')
        .eq('market_id', parseInt(marketId!))
        .gte('survey_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('survey_date', { ascending: false });

      if (error) throw error;

      // Process analytics for each commodity
      const analytics = kepokmasItems.map(item => {
        const commoditySurveys = (surveyData || []).filter(s => s.commodity_id === item.id);
        
        if (commoditySurveys.length === 0) {
          return {
            commodity_id: item.id,
            commodity_name: item.name,
            unit: item.unit,
            latest_price: 0,
            avg_price_7d: 0,
            price_trend: 0,
            stock_status: 'no_data',
            quality: 'no_data',
            survey_count: 0,
            last_survey_date: ''
          };
        }

        const prices = commoditySurveys.map(s => s.price);
        const latest = commoditySurveys[0];
        const recent7d = commoditySurveys.filter(s => 
          new Date(s.survey_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        const avg7d = recent7d.length > 0 
          ? recent7d.reduce((sum, s) => sum + s.price, 0) / recent7d.length 
          : latest.price;

        // Calculate trend (compare first and last week)
        const oldData = commoditySurveys.filter(s => 
          new Date(s.survey_date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        const oldAvg = oldData.length > 0 
          ? oldData.reduce((sum, s) => sum + s.price, 0) / oldData.length 
          : avg7d;
        
        const trend = oldAvg > 0 ? ((avg7d - oldAvg) / oldAvg) * 100 : 0;

        return {
          commodity_id: item.id,
          commodity_name: item.name,
          unit: item.unit,
          latest_price: latest.price,
          avg_price_7d: avg7d,
          price_trend: trend,
          stock_status: latest.stock_status,
          quality: latest.quality,
          survey_count: commoditySurveys.length,
          last_survey_date: latest.survey_date
        };
      });

      setCommodityAnalytics(analytics);

      // Process price history for charts
      const dailyPrices = processDailyPrices(surveyData || []);
      setPriceHistory(dailyPrices);

    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Gagal memuat analitik komoditas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processDailyPrices = (data: SurveyData[]) => {
    const dailyData: { [key: string]: { prices: number[], date: string } } = {};

    data.forEach(survey => {
      const date = survey.survey_date;
      if (!dailyData[date]) {
        dailyData[date] = { prices: [], date };
      }
      dailyData[date].prices.push(survey.price);
    });

    return Object.values(dailyData)
      .map(day => ({
        date: day.date,
        avg_price: day.prices.reduce((a, b) => a + b, 0) / day.prices.length,
        count: day.prices.length
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  };

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Tersedia</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-100 text-yellow-800">Terbatas</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800">Habis</Badge>;
      default:
        return <Badge variant="outline">Belum Ada Data</Badge>;
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Badge className="bg-blue-100 text-blue-800">Sangat Baik</Badge>;
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Baik</Badge>;
      case 'average':
        return <Badge className="bg-yellow-100 text-yellow-800">Sedang</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800">Kurang</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 2) return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (trend < -2) return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <div className="w-4 h-4" />; // Empty space for stable
  };

  const stockDistribution = commodityAnalytics.reduce((acc, item) => {
    if (item.survey_count > 0) {
      acc[item.stock_status] = (acc[item.stock_status] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const stockChartData = Object.entries(stockDistribution).map(([status, count]) => ({
    name: status === 'available' ? 'Tersedia' : status === 'limited' ? 'Terbatas' : 'Habis',
    value: count,
    status
  }));

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Memuat data komoditas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Pasar Tidak Ditemukan</h3>
            <p className="text-muted-foreground mb-4">Data pasar yang Anda cari tidak tersedia</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const surveyedCommodities = commodityAnalytics.filter(c => c.survey_count > 0);
  const avgPrice = surveyedCommodities.length > 0 
    ? surveyedCommodities.reduce((sum, c) => sum + c.latest_price, 0) / surveyedCommodities.length 
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <MapPin className="w-8 h-8 mr-3 text-primary" />
              {market.name}
            </h1>
            <p className="text-muted-foreground">{market.address}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Monitoring Kepokmas
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Komoditas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyedCommodities.length}</div>
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
              Rp {avgPrice.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Semua komoditas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stockDistribution.available || 0}
            </div>
            <p className="text-xs text-muted-foreground">komoditas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Update Terakhir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveyedCommodities.length > 0 
                ? new Date(Math.max(...surveyedCommodities.map(c => new Date(c.last_survey_date).getTime()))).toLocaleDateString('id-ID')
                : '-'
              }
            </div>
            <p className="text-xs text-muted-foreground">Survey terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="commodities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commodities">Daftar Komoditas</TabsTrigger>
          <TabsTrigger value="analytics">Analitik Harga</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi Stok</TabsTrigger>
        </TabsList>

        {/* Commodities List */}
        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle>50 Komoditas Kepokmas</CardTitle>
              <CardDescription>
                Data harga dan ketersediaan komoditas di {market.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Harga Terkini</TableHead>
                    <TableHead>Rata-rata 7 Hari</TableHead>
                    <TableHead>Tren</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Kualitas</TableHead>
                    <TableHead>Survey</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commodityAnalytics.map((commodity) => (
                    <TableRow key={commodity.commodity_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{commodity.commodity_name}</p>
                          <p className="text-sm text-muted-foreground">per {commodity.unit}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {commodity.survey_count > 0 ? (
                          <span className="font-medium">
                            Rp {commodity.latest_price.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {commodity.survey_count > 0 ? (
                          <span>
                            Rp {commodity.avg_price_7d.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(commodity.price_trend)}
                          {commodity.survey_count > 0 ? (
                            <span className={`text-sm ${
                              commodity.price_trend > 2 ? 'text-red-600' : 
                              commodity.price_trend < -2 ? 'text-green-600' : 
                              'text-muted-foreground'
                            }`}>
                              {commodity.price_trend > 0 ? '+' : ''}{commodity.price_trend.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStockStatusBadge(commodity.stock_status)}
                      </TableCell>
                      <TableCell>
                        {getQualityBadge(commodity.quality)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {commodity.survey_count} data
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Analytics */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Tren Harga 7 Hari Terakhir</CardTitle>
              <CardDescription>
                Perkembangan rata-rata harga komoditas harian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
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
                    <Line 
                      type="monotone" 
                      dataKey="avg_price" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Distribution */}
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status Ketersediaan</CardTitle>
                <CardDescription>
                  Persentase ketersediaan komoditas saat ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stockChartData.map((entry, index) => (
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
                <CardTitle>Ringkasan Monitoring</CardTitle>
                <CardDescription>
                  Status keseluruhan komoditas kepokmas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700">Tersedia</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {stockDistribution.available || 0}
                    </p>
                    <p className="text-sm text-green-600">komoditas</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-700">Terbatas</h4>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stockDistribution.limited || 0}
                    </p>
                    <p className="text-sm text-yellow-600">komoditas</p>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700">Tidak Tersedia</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {stockDistribution.unavailable || 0}
                  </p>
                  <p className="text-sm text-red-600">komoditas perlu perhatian</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Total Terdata</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {surveyedCommodities.length}
                  </p>
                  <p className="text-sm text-blue-600">dari 50 item kepokmas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketDetailPage;