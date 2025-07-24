import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, TrendingUp } from "lucide-react";

interface StockPanganData {
  id?: string;
  survey_date: string;
  commodity_name: string;
  store_name: string;
  price: number;
  stock_quantity: number;
  operator_name: string;
  notes?: string;
  created_at?: string;
}

const StockPanganPreviewTable = () => {
  const [stockData, setStockData] = useState<StockPanganData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setIsLoading(true);
      
      // Load data from localStorage (for demo purposes)
      // In production, this should be from Supabase
      const storedData = JSON.parse(localStorage.getItem('stock_pangan_data') || '[]');
      
      // Filter current month's data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const filteredData = storedData.filter((item: StockPanganData) => {
        const itemDate = new Date(item.survey_date);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      });

      // Sort by date descending
      filteredData.sort((a: StockPanganData, b: StockPanganData) => 
        new Date(b.survey_date).getTime() - new Date(a.survey_date).getTime()
      );

      setStockData(filteredData);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStockBadgeColor = (quantity: number) => {
    if (quantity > 100) return 'bg-green-100 text-green-800';
    if (quantity > 50) return 'bg-yellow-100 text-yellow-800';
    if (quantity > 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 100) return 'Berlimpah';
    if (quantity > 50) return 'Cukup';
    if (quantity > 0) return 'Terbatas';
    return 'Kosong';
  };

  const currentMonth = new Date().toLocaleDateString('id-ID', { 
    month: 'long', 
    year: 'numeric' 
  });

  const totalStores = [...new Set(stockData.map(item => item.store_name))].length;
  const totalCommodities = [...new Set(stockData.map(item => item.commodity_name))].length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Preview Data Stok Pangan - {currentMonth}</span>
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
          <Package className="w-5 h-5" />
          <span>Preview Data Stok Pangan - {currentMonth}</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>{stockData.length} data entry</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>{totalCommodities} jenis komoditas</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{totalStores} toko besar</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stockData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data stok pangan untuk bulan ini</p>
            <p className="text-sm mt-2">Mulai input data di tab "Input Stok Pangan"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Komoditas</TableHead>
                  <TableHead>Toko Besar</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Jumlah Stok</TableHead>
                  <TableHead>Status Stok</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(item.survey_date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.commodity_name}</div>
                    </TableCell>
                    <TableCell>{item.store_name}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.stock_quantity.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStockBadgeColor(item.stock_quantity)}>
                        {getStockStatus(item.stock_quantity)}
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

export default StockPanganPreviewTable;