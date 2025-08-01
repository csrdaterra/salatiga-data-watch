import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Calendar, FileText, Download } from 'lucide-react';

interface PriceSurvey {
  id: string;
  survey_date: string;
  commodity_id: number;
  market_id: number;
  price: number;
  stock_status: string;
  quality: string;
  operator_name: string;
  notes?: string;
}

interface Commodity {
  id: number;
  name: string;
  category: string;
  unit: string;
}

interface Market {
  id: number;
  name: string;
  address: string;
}

const OperatorReports = () => {
  const [priceSurveys, setPriceSurveys] = useState<PriceSurvey[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('semua');
  const [selectedCommodity, setSelectedCommodity] = useState('semua');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  const filteredSurveys = priceSurveys.filter(survey => {
    const commodity = commodities.find(c => c.id === survey.commodity_id);
    const market = markets.find(m => m.id === survey.market_id);
    
    const matchesSearch = commodity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarket = selectedMarket === 'semua' || survey.market_id.toString() === selectedMarket;
    const matchesCommodity = selectedCommodity === 'semua' || survey.commodity_id.toString() === selectedCommodity;
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && survey.survey_date >= dateFrom;
    }
    if (dateTo) {
      matchesDate = matchesDate && survey.survey_date <= dateTo;
    }
    
    return matchesSearch && matchesMarket && matchesCommodity && matchesDate;
  });

  const loadData = async () => {
    try {
      // Set default date range to current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setDateFrom(firstDay.toISOString().split('T')[0]);
      setDateTo(lastDay.toISOString().split('T')[0]);
      
      const [surveysResult, commoditiesResult, marketsResult] = await Promise.all([
        supabase
          .from('price_surveys')
          .select('*')
          .gte('survey_date', firstDay.toISOString().split('T')[0])
          .order('survey_date', { ascending: false }),
        supabase
          .from('commodities')
          .select('id, name, category, unit')
          .order('name'),
        supabase
          .from('markets')
          .select('id, name, address')
          .order('name')
      ]);

      if (surveysResult.error) throw surveysResult.error;
      if (commoditiesResult.error) throw commoditiesResult.error;
      if (marketsResult.error) throw marketsResult.error;

      setPriceSurveys(surveysResult.data || []);
      setCommodities(commoditiesResult.data || []);
      setMarkets(marketsResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCommodityName = (commodityId: number) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity?.name || 'Unknown';
  };

  const getCommodityUnit = (commodityId: number) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity?.unit || '';
  };

  const getMarketName = (marketId: number) => {
    const market = markets.find(m => m.id === marketId);
    return market?.name || 'Unknown';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockBadgeColor = (stock: string) => {
    switch (stock.toLowerCase()) {
      case 'available': case 'tersedia': return 'bg-green-100 text-green-800';
      case 'limited': case 'terbatas': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': case 'kosong': case 'habis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusText = (stock: string) => {
    switch (stock.toLowerCase()) {
      case 'available': return 'Tersedia';
      case 'limited': return 'Terbatas';
      case 'unavailable': return 'Habis';
      default: return stock;
    }
  };

  const getQualityBadgeColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': case 'sangat baik': return 'bg-green-100 text-green-800';
      case 'good': case 'baik': return 'bg-blue-100 text-blue-800';
      case 'average': case 'sedang': return 'bg-yellow-100 text-yellow-800';
      case 'poor': case 'kurang': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': return 'Sangat Baik';
      case 'good': return 'Baik';
      case 'average': return 'Sedang';
      case 'poor': return 'Kurang';
      default: return quality;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Memuat laporan data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Data Operator</h2>
          <p className="text-muted-foreground">
            Menampilkan {filteredSurveys.length} dari {priceSurveys.length} data input
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Laporan
        </Button>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter Laporan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari komoditas atau pasar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
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

            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Komoditas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Komoditas</SelectItem>
                {commodities.map((commodity) => (
                  <SelectItem key={commodity.id} value={commodity.id.toString()}>
                    {commodity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Dari Tanggal"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Sampai Tanggal"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Data Input Harga Kepokmas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Pasar</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Kualitas</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(survey.survey_date).toLocaleDateString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      {getCommodityName(survey.commodity_id)}
                      <div className="text-sm text-muted-foreground">
                        per {getCommodityUnit(survey.commodity_id)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getMarketName(survey.market_id)}</TableCell>
                  <TableCell className="font-semibold text-green-700">
                    {formatPrice(survey.price)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStockBadgeColor(survey.stock_status)}>
                      {getStockStatusText(survey.stock_status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getQualityBadgeColor(survey.quality)}>
                      {getQualityText(survey.quality)}
                    </Badge>
                  </TableCell>
                  <TableCell>{survey.operator_name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {survey.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSurveys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data yang ditemukan untuk filter ini
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorReports;