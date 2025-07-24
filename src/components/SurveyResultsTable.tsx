import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getCommodities } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";
import { FileText, Search, Calendar, BarChart3, TrendingUp, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

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

const SurveyResultsTable = () => {
  const [surveys, setSurveys] = useState<SurveyResult[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<SurveyResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [timePeriod, setTimePeriod] = useState("daily");

  const allCommodities = getCommodities();
  const markets = getMarkets();

  // Load surveys from Supabase
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

  // Set up real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_surveys'
        },
        () => {
          loadSurveys(); // Reload data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get current date ranges based on time period
  const getDateRanges = () => {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    
    // Get start of current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToMonday);
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    // Get end of current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const weekEnd = endOfWeek.toISOString().split('T')[0];
    
    // Get start and end of current year
    const yearStart = `${today.getFullYear()}-01-01`;
    const yearEnd = `${today.getFullYear()}-12-31`;
    
    return { currentDate, weekStart, weekEnd, yearStart, yearEnd };
  };

  // Filter surveys based on time period and other criteria
  useEffect(() => {
    let filtered = surveys;
    const { currentDate, weekStart, weekEnd, yearStart, yearEnd } = getDateRanges();

    // Filter by time period
    if (timePeriod === "daily") {
      filtered = filtered.filter(survey => survey.survey_date === currentDate);
    } else if (timePeriod === "weekly") {
      filtered = filtered.filter(survey => 
        survey.survey_date >= weekStart && survey.survey_date <= weekEnd
      );
    } else if (timePeriod === "yearly") {
      filtered = filtered.filter(survey => 
        survey.survey_date >= yearStart && survey.survey_date <= yearEnd
      );
    }

    // Filter by search term (commodity name)
    if (searchTerm) {
      filtered = filtered.filter(survey => {
        const commodity = allCommodities.find(c => c.id === survey.commodity_id);
        return commodity?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by market
    if (selectedMarket !== "all") {
      filtered = filtered.filter(survey => survey.market_id === parseInt(selectedMarket));
    }

    // Filter by specific date (if provided)
    if (selectedDate) {
      filtered = filtered.filter(survey => survey.survey_date === selectedDate);
    }

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredSurveys(filtered);
  }, [surveys, searchTerm, selectedMarket, selectedDate, timePeriod, allCommodities]);

  const getStockBadgeVariant = (stock: string) => {
    switch (stock) {
      case 'available':
        return 'default';
      case 'limited':
        return 'secondary';
      case 'unavailable':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStockLabel = (stock: string) => {
    switch (stock) {
      case 'available':
        return 'Tersedia';
      case 'limited':
        return 'Terbatas';
      case 'unavailable':
        return 'Habis';
      default:
        return stock;
    }
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'Sangat Baik';
      case 'good':
        return 'Baik';
      case 'average':
        return 'Sedang';
      case 'poor':
        return 'Kurang';
      default:
        return quality;
    }
  };

  const getCommodityName = (commodityId: number) => {
    const commodity = allCommodities.find(c => c.id === commodityId);
    return commodity?.name || 'Unknown';
  };

  const getMarketName = (marketId: number) => {
    const market = markets.find(m => m.id === marketId);
    return market?.name || 'Unknown';
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (filteredSurveys.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    // Prepare data for Excel with the requested format
    const excelData = filteredSurveys.map(survey => ({
      'Tanggal': new Date(survey.survey_date).toLocaleDateString('id-ID'),
      'Pasar': getMarketName(survey.market_id),
      'Nama Komoditas': getCommodityName(survey.commodity_id),
      'Harga': survey.price,
      'Status Stok': getStockLabel(survey.stock_status),
      'Kualitas': getQualityLabel(survey.quality),
      'Operator': survey.operator_name,
      'Catatan': survey.notes || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better formatting
    const colWidths = [
      { wch: 12 }, // Tanggal
      { wch: 20 }, // Pasar
      { wch: 25 }, // Nama Komoditas
      { wch: 15 }, // Harga
      { wch: 12 }, // Status Stok
      { wch: 12 }, // Kualitas
      { wch: 15 }, // Operator
      { wch: 30 }  // Catatan
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Survey Harga');

    // Generate filename with current date and period
    const periodText = timePeriod === 'daily' ? 'Harian' : 
                     timePeriod === 'weekly' ? 'Mingguan' : 'Tahunan';
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Survey_Harga_${periodText}_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  const renderSurveyTable = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Cari Komoditas</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Nama komoditas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Pasar</Label>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pasar</SelectItem>
              {markets.map(market => (
                <SelectItem key={market.id} value={market.id.toString()}>
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Filter Tanggal Tambahan</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Pilih tanggal spesifik"
          />
        </div>

        <div className="space-y-2">
          <Label>Total Data</Label>
          <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
            <span className="text-sm text-muted-foreground">
              {filteredSurveys.length} dari {surveys.length} survey
            </span>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export ke Excel
        </Button>
      </div>

      {/* Results Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pasar</TableHead>
              <TableHead>Komoditas</TableHead>
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
                  {new Date(survey.survey_date).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell className="font-medium">
                  {getMarketName(survey.market_id)}
                </TableCell>
                <TableCell>
                  {getCommodityName(survey.commodity_id)}
                </TableCell>
                <TableCell className="font-medium">
                  Rp {survey.price.toLocaleString('id-ID')}
                </TableCell>
                <TableCell>
                  <Badge variant={getStockBadgeVariant(survey.stock_status)}>
                    {getStockLabel(survey.stock_status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getQualityLabel(survey.quality)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {survey.operator_name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-40 truncate">
                  {survey.notes || '-'}
                </TableCell>
              </TableRow>
            ))}
            {filteredSurveys.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {surveys.length === 0 
                    ? "Belum ada data survey" 
                    : "Tidak ada survey yang sesuai dengan filter"
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Hasil Survey Harga Komoditas
        </CardTitle>
        <CardDescription>
          Data survey harga dengan filter periode waktu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={timePeriod} onValueChange={setTimePeriod} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Harian</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Mingguan</span>
            </TabsTrigger>
            <TabsTrigger value="yearly" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Tahunan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-1">Survey Hari Ini</h3>
                <p className="text-sm text-blue-700">
                  Menampilkan data survey untuk tanggal: {new Date().toLocaleDateString('id-ID')}
                </p>
              </div>
              {renderSurveyTable()}
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-1">Survey Minggu Ini</h3>
                <p className="text-sm text-green-700">
                  Menampilkan data survey untuk minggu saat ini (Senin - Minggu)
                </p>
              </div>
              {renderSurveyTable()}
            </div>
          </TabsContent>

          <TabsContent value="yearly">
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-1">Survey Tahun Ini</h3>
                <p className="text-sm text-purple-700">
                  Menampilkan data survey untuk tahun {new Date().getFullYear()}
                </p>
              </div>
              {renderSurveyTable()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SurveyResultsTable;