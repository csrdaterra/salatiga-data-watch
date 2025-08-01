import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileDown, BarChart3, Filter, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface PriceReport {
  commodity_name: string;
  commodity_unit: string;
  market_name: string;
  total_surveys: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  latest_survey_date: string;
  price_trend: 'up' | 'down' | 'stable';
}

interface Market {
  id: number;
  name: string;
}

const KepokmasEnhancedReports = () => {
  const { toast } = useToast();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('daily');
  const [dailyReports, setDailyReports] = useState<PriceReport[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<PriceReport[]>([]);
  const [yearlyReports, setYearlyReports] = useState<PriceReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMarkets = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDailyReports(),
        loadMonthlyReports(),
        loadYearlyReports()
      ]);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: "Error",
        description: "Gagal memuat laporan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDailyReports = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let query = supabase
        .from('price_surveys')
        .select(`
          *,
          commodities (name, unit),
          markets (name)
        `)
        .eq('survey_date', today);

      if (selectedMarket !== 'all') {
        query = query.eq('market_id', parseInt(selectedMarket));
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = processReportData(data || []);
      setDailyReports(processedData);
    } catch (error) {
      console.error('Error loading daily reports:', error);
    }
  };

  const loadMonthlyReports = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      let query = supabase
        .from('price_surveys')
        .select(`
          *,
          commodities (name, unit),
          markets (name)
        `)
        .gte('survey_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('survey_date', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      if (selectedMarket !== 'all') {
        query = query.eq('market_id', parseInt(selectedMarket));
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = processReportData(data || []);
      setMonthlyReports(processedData);
    } catch (error) {
      console.error('Error loading monthly reports:', error);
    }
  };

  const loadYearlyReports = async () => {
    try {
      const currentYear = new Date().getFullYear();
      
      let query = supabase
        .from('price_surveys')
        .select(`
          *,
          commodities (name, unit),
          markets (name)
        `)
        .gte('survey_date', `${currentYear}-01-01`)
        .lt('survey_date', `${currentYear + 1}-01-01`);

      if (selectedMarket !== 'all') {
        query = query.eq('market_id', parseInt(selectedMarket));
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = processReportData(data || []);
      setYearlyReports(processedData);
    } catch (error) {
      console.error('Error loading yearly reports:', error);
    }
  };

  const processReportData = (data: any[]): PriceReport[] => {
    const grouped = data.reduce((acc, item) => {
      const key = `${item.commodity_id}_${item.market_id}`;
      if (!acc[key]) {
        acc[key] = {
          commodity_name: item.commodities?.name || 'Unknown',
          commodity_unit: item.commodities?.unit || 'Unit',
          market_name: item.markets?.name || 'Unknown Market',
          prices: [],
          survey_dates: []
        };
      }
      acc[key].prices.push(item.price);
      acc[key].survey_dates.push(item.survey_date);
      return acc;
    }, {});

    return Object.values(grouped).map((group: any) => {
      const prices = group.prices.sort((a: number, b: number) => a - b);
      const avgPrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
      
      // Simple trend calculation (comparing first and last price)
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (prices.length > 1) {
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        if (lastPrice > firstPrice * 1.05) trend = 'up';
        else if (lastPrice < firstPrice * 0.95) trend = 'down';
      }

      return {
        commodity_name: group.commodity_name,
        commodity_unit: group.commodity_unit,
        market_name: group.market_name,
        total_surveys: group.prices.length,
        avg_price: avgPrice,
        min_price: Math.min(...prices),
        max_price: Math.max(...prices),
        latest_survey_date: group.survey_dates.sort().reverse()[0],
        price_trend: trend
      } as PriceReport;
    });
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  useEffect(() => {
    if (markets.length > 0) {
      loadReports();
    }
  }, [markets, selectedMarket]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTrendBadge = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <Badge variant="destructive" className="gap-1"><TrendingUp className="h-3 w-3" />Naik</Badge>;
      case 'down':
        return <Badge variant="default" className="gap-1">Turun</Badge>;
      default:
        return <Badge variant="secondary">Stabil</Badge>;
    }
  };

  const exportToCSV = (data: PriceReport[], filename: string) => {
    const csvData = data.map(item => ({
      'Komoditas': item.commodity_name,
      'Satuan': item.commodity_unit,
      'Pasar': item.market_name,
      'Total Survey': item.total_surveys,
      'Rata-rata Harga': item.avg_price,
      'Harga Minimum': item.min_price,
      'Harga Maksimum': item.max_price,
      'Survey Terakhir': format(new Date(item.latest_survey_date), 'dd/MM/yyyy'),
      'Trend': item.price_trend
    }));

    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Harga');
    XLSX.writeFile(wb, `${filename}.xlsx`);

    toast({
      title: "Berhasil",
      description: `Laporan berhasil diekspor ke ${filename}.xlsx`,
    });
  };

  const renderReportTable = (data: PriceReport[], title: string, filename: string) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              {data.length} laporan komoditas
              {selectedMarket !== 'all' && ` untuk ${markets.find(m => m.id.toString() === selectedMarket)?.name}`}
            </CardDescription>
          </div>
          <Button 
            onClick={() => exportToCSV(data, filename)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada data untuk periode dan filter yang dipilih
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Komoditas</TableHead>
                <TableHead>Pasar</TableHead>
                <TableHead>Survey</TableHead>
                <TableHead>Rata-rata</TableHead>
                <TableHead>Min - Max</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.commodity_name}</div>
                      <div className="text-sm text-muted-foreground">{item.commodity_unit}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.market_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.total_surveys} survey</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(item.avg_price)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatPrice(item.min_price)} - {formatPrice(item.max_price)}
                  </TableCell>
                  <TableCell>
                    {getTrendBadge(item.price_trend)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading laporan...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Laporan Survey Harga
          </h2>
          <p className="text-muted-foreground">
            Laporan harian, bulanan, dan tahunan survey harga komoditas
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Filter Pasar</label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
            <div className="flex items-end">
              <Button onClick={loadReports} variant="outline">
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Harian</TabsTrigger>
          <TabsTrigger value="monthly">Bulanan</TabsTrigger>
          <TabsTrigger value="yearly">Tahunan</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          {renderReportTable(
            dailyReports, 
            `Laporan Harian - ${format(new Date(), 'dd MMMM yyyy')}`,
            `Laporan_Harian_${format(new Date(), 'yyyy-MM-dd')}`
          )}
        </TabsContent>

        <TabsContent value="monthly">
          {renderReportTable(
            monthlyReports, 
            `Laporan Bulanan - ${format(new Date(), 'MMMM yyyy')}`,
            `Laporan_Bulanan_${format(new Date(), 'yyyy-MM')}`
          )}
        </TabsContent>

        <TabsContent value="yearly">
          {renderReportTable(
            yearlyReports, 
            `Laporan Tahunan ${new Date().getFullYear()}`,
            `Laporan_Tahunan_${new Date().getFullYear()}`
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KepokmasEnhancedReports;