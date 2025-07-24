import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getCommodities } from "@/stores/commodityStore";
import { useToast } from "@/hooks/use-toast";
import { Calendar, TrendingUp } from "lucide-react";

interface PriceSurveyData {
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

const KepokmasPreviewTable = () => {
  const [surveyData, setSurveyData] = useState<PriceSurveyData[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load commodities
      const commoditiesData = await getCommodities();
      setCommodities(commoditiesData);

      // Get current month's data
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('price_surveys')
        .select('*')
        .gte('survey_date', firstDayOfMonth.toISOString().split('T')[0])
        .lte('survey_date', lastDayOfMonth.toISOString().split('T')[0])
        .order('survey_date', { ascending: false });

      if (error) {
        throw error;
      }

      setSurveyData(data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data survey kepokmas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCommodityName = (commodityId: number) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity?.name || 'Unknown';
  };

  const getCommodityUnit = (commodityId: number) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity?.unit || '';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getQualityBadgeColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'baik': return 'bg-green-100 text-green-800';
      case 'sedang': return 'bg-yellow-100 text-yellow-800';
      case 'buruk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockBadgeColor = (stock: string) => {
    switch (stock.toLowerCase()) {
      case 'tersedia': return 'bg-green-100 text-green-800';
      case 'terbatas': return 'bg-yellow-100 text-yellow-800';
      case 'kosong': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentMonth = new Date().toLocaleDateString('id-ID', { 
    month: 'long', 
    year: 'numeric' 
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Preview Data Kepokmas - {currentMonth}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <span>Memuat data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Preview Data Kepokmas - {currentMonth}</span>
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Total {surveyData.length} data survey bulan ini</span>
        </div>
      </CardHeader>
      <CardContent>
        {surveyData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data survey untuk bulan ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Komoditas</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Kualitas</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {new Date(item.survey_date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getCommodityName(item.commodity_id)}</div>
                        <div className="text-sm text-muted-foreground">
                          per {getCommodityUnit(item.commodity_id)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStockBadgeColor(item.stock_status)}>
                        {item.stock_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getQualityBadgeColor(item.quality)}>
                        {item.quality}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.operator_name}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={item.notes}>
                        {item.notes || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KepokmasPreviewTable;