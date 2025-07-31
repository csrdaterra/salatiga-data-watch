import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceReport {
  commodity_id: number;
  commodity_name: string;
  category: string;
  unit: string;
  market_id: number;
  market_name: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  price_count: number;
  last_survey_date: string;
}

interface TrendData {
  commodity_id: number;
  commodity_name: string;
  current_avg: number;
  previous_avg: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'stable';
}

const KepokmasReports = () => {
  const [dailyReport, setDailyReport] = useState<PriceReport[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<PriceReport[]>([]);
  const [annualReport, setAnnualReport] = useState<PriceReport[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [selectedMarket, setSelectedMarket] = useState('semua');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [markets, setMarkets] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMarkets = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
    }
  };

  const loadDailyReport = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const query = supabase
        .from('price_surveys')
        .select(`
          commodity_id,
          market_id,
          price,
          survey_date,
          commodities!inner(name, category, unit),
          markets!inner(name)
        `)
        .eq('survey_date', today);

      if (selectedMarket !== 'semua') {
        query.eq('market_id', parseInt(selectedMarket));
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Process data
      const processedData = processFallbackData(data || []);
      setDailyReport(processedData);
    } catch (error) {
      console.error('Error loading daily report:', error);
      setDailyReport([]);
    }
  };

  const loadMonthlyReport = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const startDate = `${currentMonth}-01`;
      
      const query = supabase
        .from('price_surveys')
        .select(`
          commodity_id,
          market_id,
          price,
          survey_date,
          commodities!inner(name, category, unit),
          markets!inner(name)
        `)
        .gte('survey_date', startDate);

      if (selectedMarket !== 'semua') {
        query.eq('market_id', parseInt(selectedMarket));
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = processFallbackData(data || []);
      setMonthlyReport(processedData);
    } catch (error) {
      console.error('Error loading monthly report:', error);
    }
  };

  const loadAnnualReport = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      
      const query = supabase
        .from('price_surveys')
        .select(`
          commodity_id,
          market_id,
          price,
          survey_date,
          commodities!inner(name, category, unit),
          markets!inner(name)
        `)
        .gte('survey_date', startDate);

      if (selectedMarket !== 'semua') {
        query.eq('market_id', parseInt(selectedMarket));
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = processFallbackData(data || []);
      setAnnualReport(processedData);
    } catch (error) {
      console.error('Error loading annual report:', error);
    }
  };

  const processFallbackData = (rawData: any[]): PriceReport[] => {
    const grouped = rawData.reduce((acc, item) => {
      const key = `${item.commodity_id}-${item.market_id}`;
      if (!acc[key]) {
        acc[key] = {
          commodity_id: item.commodity_id,
          commodity_name: item.commodities.name,
          category: item.commodities.category,
          unit: item.commodities.unit,
          market_id: item.market_id,
          market_name: item.markets.name,
          prices: [],
          last_survey_date: item.survey_date
        };
      }
      acc[key].prices.push(item.price);
      if (item.survey_date > acc[key].last_survey_date) {
        acc[key].last_survey_date = item.survey_date;
      }
      return acc;
    }, {});

    return Object.values(grouped).map((group: any) => ({
      commodity_id: group.commodity_id,
      commodity_name: group.commodity_name,
      category: group.category,
      unit: group.unit,
      market_id: group.market_id,
      market_name: group.market_name,
      avg_price: group.prices.reduce((a: number, b: number) => a + b, 0) / group.prices.length,
      min_price: Math.min(...group.prices),
      max_price: Math.max(...group.prices),
      price_count: group.prices.length,
      last_survey_date: group.last_survey_date
    }));
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadDailyReport(),
      loadMonthlyReport(),
      loadAnnualReport()
    ]).finally(() => setLoading(false));
  }, [selectedMarket]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const exportToCSV = (data: PriceReport[], filename: string) => {
    const csvContent = [
      ['Komoditas', 'Kategori', 'Pasar', 'Harga Rata-rata', 'Harga Min', 'Harga Max', 'Jumlah Data', 'Tanggal Terakhir'],
      ...data.map(item => [
        item.commodity_name,
        item.category,
        item.market_name,
        item.avg_price.toString(),
        item.min_price.toString(),
        item.max_price.toString(),
        item.price_count.toString(),
        item.last_survey_date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderReportTable = (data: PriceReport[], title: string, filename: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => exportToCSV(data, filename)}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Komoditas</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Pasar</TableHead>
              <TableHead>Harga Rata-rata</TableHead>
              <TableHead>Harga Min</TableHead>
              <TableHead>Harga Max</TableHead>
              <TableHead>Jumlah Data</TableHead>
              <TableHead>Terakhir Survey</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={`${item.commodity_id}-${item.market_id}-${index}`}>
                <TableCell className="font-medium">
                  <div>
                    {item.commodity_name}
                    <div className="text-sm text-muted-foreground">
                      per {item.unit}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell>{item.market_name}</TableCell>
                <TableCell className="font-semibold text-green-700">
                  {formatPrice(item.avg_price)}
                </TableCell>
                <TableCell>{formatPrice(item.min_price)}</TableCell>
                <TableCell>{formatPrice(item.max_price)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.price_count}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {new Date(item.last_survey_date).toLocaleDateString('id-ID')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada data untuk periode ini
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Memuat laporan...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Harga Komoditas</h2>
          <p className="text-muted-foreground">
            Laporan harian, bulanan, dan tahunan harga komoditas kepokmas
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Pasar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Pasar</SelectItem>
                {markets.map((market) => (
                  <SelectItem key={market.id} value={market.id.toString()}>
                    {market.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Laporan Harian</TabsTrigger>
          <TabsTrigger value="monthly">Laporan Bulanan</TabsTrigger>
          <TabsTrigger value="annual">Laporan Tahunan</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          {renderReportTable(
            dailyReport, 
            `Laporan Harga Harian - ${new Date().toLocaleDateString('id-ID')}`,
            `laporan-harian-${new Date().toISOString().split('T')[0]}.csv`
          )}
        </TabsContent>

        <TabsContent value="monthly">
          {renderReportTable(
            monthlyReport, 
            `Laporan Harga Bulanan - ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
            `laporan-bulanan-${new Date().toISOString().slice(0, 7)}.csv`
          )}
        </TabsContent>

        <TabsContent value="annual">
          {renderReportTable(
            annualReport, 
            `Laporan Harga Tahunan - ${new Date().getFullYear()}`,
            `laporan-tahunan-${new Date().getFullYear()}.csv`
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KepokmasReports;