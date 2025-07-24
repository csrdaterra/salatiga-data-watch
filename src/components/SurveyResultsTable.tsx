import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getCommodities } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";
import { FileText, Search } from "lucide-react";

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

  const allCommodities = getCommodities();
  const markets = getMarkets();

  // Load surveys from localStorage
  useEffect(() => {
    const savedSurveys = JSON.parse(localStorage.getItem('price_surveys') || '[]');
    setSurveys(savedSurveys);
  }, []);

  // Filter surveys based on search criteria
  useEffect(() => {
    let filtered = surveys;

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

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(survey => survey.survey_date === selectedDate);
    }

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredSurveys(filtered);
  }, [surveys, searchTerm, selectedMarket, selectedDate, allCommodities]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Hasil Survey Harga Komoditas
        </CardTitle>
        <CardDescription>
          Data survey harga yang telah diinput operator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Label>Tanggal Survey</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
      </CardContent>
    </Card>
  );
};

export default SurveyResultsTable;