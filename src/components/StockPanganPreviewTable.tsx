import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Package, TrendingUp, Filter, RefreshCw } from "lucide-react";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";

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
  const [allStockData, setAllStockData] = useState<StockPanganData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("last30days");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setIsLoading(true);
      
      // Load data from localStorage (for demo purposes)
      // In production, this should be from Supabase
      const storedData = JSON.parse(localStorage.getItem('stock_pangan_data') || '[]');
      
      // Sort by date descending (newest first)
      const sortedData = storedData.sort((a: StockPanganData, b: StockPanganData) => 
        new Date(b.survey_date).getTime() - new Date(a.survey_date).getTime()
      );

      setAllStockData(sortedData);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = [...allStockData];

    // Apply date filter
    if (filterType === 'day' && selectedDate) {
      filtered = filtered.filter(item => item.survey_date === selectedDate);
    } else if (filterType === 'month' && selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.survey_date);
        return itemDate.getFullYear() === parseInt(year) && 
               itemDate.getMonth() === parseInt(month) - 1;
      });
    } else if (filterType === 'year' && selectedYear) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.survey_date);
        return itemDate.getFullYear() === parseInt(selectedYear);
      });
    } else if (filterType === 'last30days') {
      const thirtyDaysAgo = subDays(new Date(), 30);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.survey_date);
        return itemDate >= thirtyDaysAgo;
      });
    }

    // Apply store filter
    if (selectedStore !== 'all') {
      filtered = filtered.filter(item => item.store_name === selectedStore);
    }

    // Apply commodity filter
    if (selectedCommodity !== 'all') {
      filtered = filtered.filter(item => item.commodity_name === selectedCommodity);
    }

    return filtered;
  }, [allStockData, filterType, selectedDate, selectedMonth, selectedYear, selectedStore, selectedCommodity]);

  // Get unique stores and commodities for filters
  const uniqueStores = useMemo(() => {
    const stores = [...new Set(allStockData.map(item => item.store_name))];
    return stores.filter(Boolean).sort();
  }, [allStockData]);

  const uniqueCommodities = useMemo(() => {
    const commodities = [...new Set(allStockData.map(item => item.commodity_name))];
    return commodities.filter(Boolean).sort();
  }, [allStockData]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalEntries = filteredData.length;
    const uniqueStoresCount = new Set(filteredData.map(item => item.store_name)).size;
    const uniqueCommoditiesCount = new Set(filteredData.map(item => item.commodity_name)).size;
    const totalStock = filteredData.reduce((sum, item) => sum + item.stock_quantity, 0);
    const averagePrice = filteredData.length > 0 
      ? filteredData.reduce((sum, item) => sum + item.price, 0) / filteredData.length 
      : 0;

    return {
      totalEntries,
      uniqueStoresCount,
      uniqueCommoditiesCount,
      totalStock,
      averagePrice
    };
  }, [filteredData]);

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

  const getFilterLabel = () => {
    switch (filterType) {
      case 'day':
        return `Tanggal: ${format(new Date(selectedDate), 'dd MMMM yyyy', { locale: id })}`;
      case 'month':
        return `Bulan: ${format(new Date(selectedMonth + '-01'), 'MMMM yyyy', { locale: id })}`;
      case 'year':
        return `Tahun: ${selectedYear}`;
      case 'last30days':
        return '30 Hari Terakhir';
      default:
        return 'Semua Data';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Preview Stok Pangan</h2>
          <p className="text-muted-foreground">
            Data stok pangan dari toko-toko besar - {getFilterLabel()}
          </p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entri</p>
                <p className="text-xl font-bold">{summaryStats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toko</p>
                <p className="text-xl font-bold">{summaryStats.uniqueStoresCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Komoditas</p>
                <p className="text-xl font-bold">{summaryStats.uniqueCommoditiesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stok</p>
                <p className="text-xl font-bold">{summaryStats.totalStock.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata Harga</p>
                <p className="text-xl font-bold">{formatPrice(summaryStats.averagePrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Date Filter Type */}
            <div>
              <Label>Filter Waktu</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last30days">30 Hari Terakhir</SelectItem>
                  <SelectItem value="day">Per Hari</SelectItem>
                  <SelectItem value="month">Per Bulan</SelectItem>
                  <SelectItem value="year">Per Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Specific Filter */}
            {filterType === 'day' && (
              <div>
                <Label>Pilih Tanggal</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {filterType === 'month' && (
              <div>
                <Label>Pilih Bulan</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {filterType === 'year' && (
              <div>
                <Label>Pilih Tahun</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Store Filter */}
            <div>
              <Label>Filter Toko</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Toko</SelectItem>
                  {uniqueStores.map(store => (
                    <SelectItem key={store} value={store}>
                      {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Commodity Filter */}
            <div>
              <Label>Filter Komoditas</Label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Komoditas</SelectItem>
                  {uniqueCommodities.map(commodity => (
                    <SelectItem key={commodity} value={commodity}>
                      {commodity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Data Stok Pangan ({filteredData.length} entri)</CardTitle>
            <div className="text-sm text-muted-foreground">
              {getFilterLabel()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Toko</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Status Stok</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(new Date(item.survey_date), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell className="font-medium">{item.commodity_name}</TableCell>
                      <TableCell>{item.store_name}</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>{item.stock_quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStockBadgeColor(item.stock_quantity)}>
                          {getStockStatus(item.stock_quantity)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.operator_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data untuk filter yang dipilih</p>
              <p className="text-sm">Silakan ubah filter atau input data stok pangan terlebih dahulu</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockPanganPreviewTable;