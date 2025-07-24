import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 50 Komoditas dari CommoditySurveyForm
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

interface WeeklyComparison {
  commodityId: number;
  commodityName: string;
  unit: string;
  thisWeekAvg: number;
  lastWeekAvg: number;
  changePercent: number;
  changeAmount: number;
  trend: 'up' | 'down' | 'stable';
  marketData: {
    marketName: string;
    thisWeek: number;
    lastWeek: number;
    change: number;
  }[];
}

interface MarketComparison {
  marketName: string;
  thisWeekAvg: number;
  lastWeekAvg: number;
  changePercent: number;
  commodityCount: number;
}

const WeeklyComparisonAnalytics = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyComparison[]>([]);
  const [marketComparisons, setMarketComparisons] = useState<MarketComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [markets, setMarkets] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadWeeklyComparison();
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
    }
  };

  const loadWeeklyComparison = async () => {
    try {
      setIsLoading(true);

      const today = new Date();
      const thisWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const thisWeekEnd = new Date(thisWeekStart);
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(thisWeekStart);
      lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

      // Get this week's data
      const { data: thisWeekData, error: thisWeekError } = await supabase
        .from('price_surveys')
        .select(`
          commodity_id,
          price,
          markets!inner(name)
        `)
        .gte('survey_date', thisWeekStart.toISOString().split('T')[0])
        .lte('survey_date', thisWeekEnd.toISOString().split('T')[0]);

      if (thisWeekError) throw thisWeekError;

      // Get last week's data
      const { data: lastWeekData, error: lastWeekError } = await supabase
        .from('price_surveys')
        .select(`
          commodity_id,
          price,
          markets!inner(name)
        `)
        .gte('survey_date', lastWeekStart.toISOString().split('T')[0])
        .lte('survey_date', lastWeekEnd.toISOString().split('T')[0]);

      if (lastWeekError) throw lastWeekError;

      // Process data
      const comparisons = processWeeklyComparisons(thisWeekData || [], lastWeekData || []);
      setWeeklyData(comparisons);

      // Process market comparisons
      const marketComps = processMarketComparisons(thisWeekData || [], lastWeekData || []);
      setMarketComparisons(marketComps);

    } catch (error) {
      console.error('Error loading weekly comparison:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data perbandingan mingguan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processWeeklyComparisons = (thisWeekData: any[], lastWeekData: any[]): WeeklyComparison[] => {
    return kepokmasItems.map(commodity => {
      // Filter data for this commodity
      const thisWeekPrices = thisWeekData.filter(d => d.commodity_id === commodity.id);
      const lastWeekPrices = lastWeekData.filter(d => d.commodity_id === commodity.id);

      // Calculate averages
      const thisWeekAvg = thisWeekPrices.length > 0 
        ? thisWeekPrices.reduce((sum, item) => sum + item.price, 0) / thisWeekPrices.length 
        : 0;
      
      const lastWeekAvg = lastWeekPrices.length > 0 
        ? lastWeekPrices.reduce((sum, item) => sum + item.price, 0) / lastWeekPrices.length 
        : 0;

      // Calculate changes
      const changeAmount = thisWeekAvg - lastWeekAvg;
      const changePercent = lastWeekAvg > 0 ? (changeAmount / lastWeekAvg) * 100 : 0;

      // Determine trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(changePercent) > 1) { // >1% change is significant
        trend = changePercent > 0 ? 'up' : 'down';
      }

      // Get market-specific data
      const marketData = markets.map(market => {
        const thisWeekMarketPrices = thisWeekPrices.filter(d => d.markets.name === market.name);
        const lastWeekMarketPrices = lastWeekPrices.filter(d => d.markets.name === market.name);

        const thisWeekMarketAvg = thisWeekMarketPrices.length > 0
          ? thisWeekMarketPrices.reduce((sum, item) => sum + item.price, 0) / thisWeekMarketPrices.length
          : 0;

        const lastWeekMarketAvg = lastWeekMarketPrices.length > 0
          ? lastWeekMarketPrices.reduce((sum, item) => sum + item.price, 0) / lastWeekMarketPrices.length
          : 0;

        return {
          marketName: market.name,
          thisWeek: thisWeekMarketAvg,
          lastWeek: lastWeekMarketAvg,
          change: thisWeekMarketAvg - lastWeekMarketAvg
        };
      });

      return {
        commodityId: commodity.id,
        commodityName: commodity.name,
        unit: commodity.unit,
        thisWeekAvg,
        lastWeekAvg,
        changePercent,
        changeAmount,
        trend,
        marketData
      };
    });
  };

  const processMarketComparisons = (thisWeekData: any[], lastWeekData: any[]): MarketComparison[] => {
    return markets.map(market => {
      const thisWeekMarketData = thisWeekData.filter(d => d.markets.name === market.name);
      const lastWeekMarketData = lastWeekData.filter(d => d.markets.name === market.name);

      const thisWeekAvg = thisWeekMarketData.length > 0
        ? thisWeekMarketData.reduce((sum, item) => sum + item.price, 0) / thisWeekMarketData.length
        : 0;

      const lastWeekAvg = lastWeekMarketData.length > 0
        ? lastWeekMarketData.reduce((sum, item) => sum + item.price, 0) / lastWeekMarketData.length
        : 0;

      const changePercent = lastWeekAvg > 0 ? ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 : 0;

      return {
        marketName: market.name,
        thisWeekAvg,
        lastWeekAvg,
        changePercent,
        commodityCount: thisWeekMarketData.length
      };
    });
  };

  const filteredData = useMemo(() => {
    if (selectedMarket === "all") return weeklyData;
    return weeklyData.filter(item => 
      item.marketData.some(market => market.marketName === selectedMarket && market.thisWeek > 0)
    );
  }, [weeklyData, selectedMarket]);

  const summaryStats = useMemo(() => {
    const validData = filteredData.filter(item => item.thisWeekAvg > 0 && item.lastWeekAvg > 0);
    
    return {
      totalCommodities: validData.length,
      priceIncreases: validData.filter(item => item.trend === 'up').length,
      priceDecreases: validData.filter(item => item.trend === 'down').length,
      priceStable: validData.filter(item => item.trend === 'stable').length,
      avgChangePercent: validData.length > 0 
        ? validData.reduce((sum, item) => sum + item.changePercent, 0) / validData.length 
        : 0
    };
  }, [filteredData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendBadge = (trend: string, changePercent: number) => {
    const color = trend === 'up' ? 'destructive' : trend === 'down' ? 'default' : 'secondary';
    const prefix = changePercent > 0 ? '+' : '';
    return (
      <Badge variant={color}>
        {prefix}{changePercent.toFixed(1)}%
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analisis Perbandingan Mingguan</h2>
          <p className="text-muted-foreground">
            Perbandingan harga rata-rata minggu ini vs minggu lalu untuk 50 komoditas dari 3 pasar
          </p>
        </div>
        <Button onClick={loadWeeklyComparison} variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Komoditas</p>
                <p className="text-2xl font-bold">{summaryStats.totalCommodities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harga Naik</p>
                <p className="text-2xl font-bold text-red-500">{summaryStats.priceIncreases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harga Turun</p>
                <p className="text-2xl font-bold text-green-500">{summaryStats.priceDecreases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Minus className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harga Stabil</p>
                <p className="text-2xl font-bold text-gray-500">{summaryStats.priceStable}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata Perubahan</p>
                <p className={`text-2xl font-bold ${summaryStats.avgChangePercent >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {summaryStats.avgChangePercent >= 0 ? '+' : ''}{summaryStats.avgChangePercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Filter Pasar:</label>
        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Pasar</SelectItem>
            {markets.map(market => (
              <SelectItem key={market.id} value={market.name}>
                {market.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Analysis Tabs */}
      <Tabs defaultValue="commodities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="commodities">Analisis per Komoditas</TabsTrigger>
          <TabsTrigger value="markets">Analisis per Pasar</TabsTrigger>
        </TabsList>

        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Harga Mingguan per Komoditas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Minggu Ini</TableHead>
                      <TableHead>Minggu Lalu</TableHead>
                      <TableHead>Perubahan</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData
                      .filter(item => item.thisWeekAvg > 0 || item.lastWeekAvg > 0)
                      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                      .map((item) => (
                        <TableRow key={item.commodityId}>
                          <TableCell className="font-medium">{item.commodityName}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{formatPrice(item.thisWeekAvg)}</TableCell>
                          <TableCell>{formatPrice(item.lastWeekAvg)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className={item.changeAmount >= 0 ? 'text-red-500' : 'text-green-500'}>
                                {item.changeAmount >= 0 ? '+' : ''}{formatPrice(item.changeAmount)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {getTrendIcon(item.trend)}
                              {getTrendBadge(item.trend, item.changePercent)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.thisWeekAvg > 0 && item.lastWeekAvg > 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Harga Rata-rata per Pasar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketComparisons.map((market) => (
                  <Card key={market.marketName}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{market.marketName}</h3>
                          <Badge variant={market.changePercent >= 0 ? 'destructive' : 'default'}>
                            {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Minggu Ini:</span>
                            <span className="font-medium">{formatPrice(market.thisWeekAvg)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Minggu Lalu:</span>
                            <span className="font-medium">{formatPrice(market.lastWeekAvg)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Data Komoditas:</span>
                            <span className="font-medium">{market.commodityCount} items</span>
                          </div>
                        </div>

                        <Progress 
                          value={Math.abs(market.changePercent)} 
                          className="w-full h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyComparisonAnalytics;