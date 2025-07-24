import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { getCommodities } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface SurveyResult {
  id: string;
  market_id: number;
  commodity_id: number;
  price: number;
  stock_status: 'available' | 'limited' | 'unavailable';
  quality: 'excellent' | 'good' | 'average' | 'poor';
  notes?: string;
  survey_date: string;
  operator_name: string;
  created_at: string;
}

const SurveyAnalytics = () => {
  const [surveys, setSurveys] = useState<SurveyResult[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [timePeriod, setTimePeriod] = useState("weekly");

  const allCommodities = getCommodities();
  const markets = getMarkets();

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('price_surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveys((data || []) as SurveyResult[]);
    } catch (error: any) {
      console.error('Error loading surveys:', error);
    }
  };

  // Filter surveys based on time period
  const getFilteredSurveys = () => {
    if (surveys.length === 0) return [];
    
    const today = new Date();
    let filtered = surveys;

    if (timePeriod === "daily") {
      const currentDate = today.toISOString().split('T')[0];
      filtered = surveys.filter(survey => survey.survey_date === currentDate);
    } else if (timePeriod === "weekly") {
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(today.getDate() - daysToMonday);
      const weekStart = startOfWeek.toISOString().split('T')[0];
      filtered = surveys.filter(survey => survey.survey_date >= weekStart);
    } else if (timePeriod === "monthly") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthStart = startOfMonth.toISOString().split('T')[0];
      filtered = surveys.filter(survey => survey.survey_date >= monthStart);
    }

    if (selectedCommodity !== "all") {
      filtered = filtered.filter(survey => survey.commodity_id === parseInt(selectedCommodity));
    }

    return filtered;
  };

  const filteredSurveys = getFilteredSurveys();

  // Calculate key statistics
  const getStatistics = () => {
    if (filteredSurveys.length === 0) return null;

    const prices = filteredSurveys.map(s => s.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const stockCounts = filteredSurveys.reduce((acc, survey) => {
      acc[survey.stock_status] = (acc[survey.stock_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const qualityCounts = filteredSurveys.reduce((acc, survey) => {
      acc[survey.quality] = (acc[survey.quality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSurveys: filteredSurveys.length,
      avgPrice,
      minPrice,
      maxPrice,
      stockCounts,
      qualityCounts
    };
  };

  // Prepare chart data
  const getPriceChartData = () => {
    const commodityGroups = filteredSurveys.reduce((acc, survey) => {
      const commodity = allCommodities.find(c => c.id === survey.commodity_id);
      const commodityName = commodity?.name || 'Unknown';
      
      if (!acc[commodityName]) {
        acc[commodityName] = [];
      }
      acc[commodityName].push(survey.price);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(commodityGroups).map(([name, prices]) => ({
      commodity: name,
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      count: prices.length
    }));
  };

  const getStockStatusData = () => {
    const stats = getStatistics();
    if (!stats) return [];

    return Object.entries(stats.stockCounts).map(([status, count]) => ({
      name: status === 'available' ? 'Tersedia' : status === 'limited' ? 'Terbatas' : 'Habis',
      value: count,
      color: status === 'available' ? 'hsl(var(--chart-1))' : 
             status === 'limited' ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-3))'
    }));
  };

  const statistics = getStatistics();
  const priceChartData = getPriceChartData();
  const stockStatusData = getStockStatusData();

  if (!statistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analisa & Statistik
          </CardTitle>
          <CardDescription>
            Belum ada data untuk dianalisa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Silakan input survey terlebih dahulu untuk melihat analisa
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Periode Waktu</Label>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Komoditas</Label>
          <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Komoditas</SelectItem>
              {allCommodities.map(commodity => (
                <SelectItem key={commodity.id} value={commodity.id.toString()}>
                  {commodity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalSurveys}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Harga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {Math.round(statistics.avgPrice).toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Harga Terendah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {statistics.minPrice.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Harga Tertinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {statistics.maxPrice.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analisa Harga per Komoditas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="commodity" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `Rp ${Math.round(value).toLocaleString('id-ID')}`,
                    name === 'avgPrice' ? 'Rata-rata' :
                    name === 'minPrice' ? 'Minimum' : 'Maximum'
                  ]}
                />
                <Bar dataKey="avgPrice" fill="hsl(var(--chart-1))" name="avgPrice" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Distribusi Status Stok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quality Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Analisa Kualitas Komoditas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statistics.qualityCounts).map(([quality, count]) => (
              <div key={quality} className="text-center space-y-2">
                <Badge variant="outline" className="w-full">
                  {quality === 'excellent' ? 'Sangat Baik' :
                   quality === 'good' ? 'Baik' :
                   quality === 'average' ? 'Sedang' : 'Kurang'}
                </Badge>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">
                  {((count / statistics.totalSurveys) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyAnalytics;