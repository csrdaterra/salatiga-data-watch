import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCommodities } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";
import { FileText, Search, Calendar, Download, Edit, Trash2 } from "lucide-react";
import * as XLSX from 'xlsx';

interface StockBapoktingData {
  id: string;
  survey_date: string;
  commodity_id: number;
  store_name: string;
  january_capaian: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  operator_name: string;
  created_at: string;
}

const StockBapoktingTable = () => {
  const [stockData, setStockData] = useState<StockBapoktingData[]>([]);
  const [filteredData, setFilteredData] = useState<StockBapoktingData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const allCommodities = getCommodities();
  const markets = getMarkets();

  useEffect(() => {
    loadStockData();
  }, []);

  useEffect(() => {
    filterData();
  }, [stockData, searchTerm, selectedStore, selectedYear]);

  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stock_bapokting')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStockData((data || []) as StockBapoktingData[]);
    } catch (error: any) {
      console.error('Error loading stock data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data stok bapokting",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('stock-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_bapokting'
        },
        () => {
          loadStockData(); // Reload data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filterData = () => {
    let filtered = stockData;

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter(item => 
        new Date(item.survey_date).getFullYear().toString() === selectedYear
      );
    }

    // Filter by store name
    if (selectedStore !== "all") {
      filtered = filtered.filter(item => 
        item.store_name.toLowerCase().includes(selectedStore.toLowerCase())
      );
    }

    // Filter by search term (commodity name or store name)
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const commodity = allCommodities.find(c => c.id === item.commodity_id);
        const commodityName = commodity?.name || '';
        return commodityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.store_name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredData(filtered);
  };

  const getCommodityName = (commodityId: number) => {
    const commodity = allCommodities.find(c => c.id === commodityId);
    return commodity?.name || 'Unknown';
  };

  const getUniqueStores = () => {
    const stores = [...new Set(stockData.map(item => item.store_name))];
    return stores.filter(store => store && store.trim() !== '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('stock_bapokting')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data berhasil dihapus"
      });

      loadStockData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus data",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data untuk diekspor",
        variant: "destructive"
      });
      return;
    }

    const exportData = filteredData.map((row, index) => [
      index + 1, // No
      row.survey_date, // Tanggal Survey
      getCommodityName(row.commodity_id), // Komoditas
      row.store_name, // Nama Toko Besar
      row.january_capaian, // Januari (capaian)
      row.february, // Feb
      row.march, // Mar
      row.april, // Apr
      row.may, // Mei
      row.june, // Jun
      row.july, // Jul
      row.august, // Agt
      row.september, // Sep
      row.october, // Okt
      row.november, // Nov
      row.december // Des
    ]);

    // Add header
    const headers = [
      'No', 'Tanggal Survey', 'Komoditas', 'Nama Toko Besar',
      'Januari (capaian)', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const finalData = [headers, ...exportData];

    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Stok Bapokting');

    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Data_Stok_Bapokting_${selectedYear}_${currentDate}.xlsx`;
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export Berhasil",
      description: `Data berhasil diekspor ke ${filename}`
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Data Stok Bapokting
        </CardTitle>
        <CardDescription>
          Kelola dan lihat data stok bapokting yang telah diinput
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Cari</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Komoditas atau toko..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Toko</Label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Toko</SelectItem>
                {getUniqueStores().map(store => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tahun</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Total Data</Label>
            <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
              <span className="text-sm text-muted-foreground">
                {filteredData.length} dari {stockData.length} data
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export ke Excel
          </Button>
        </div>

        {/* Results Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Nama Toko</TableHead>
                <TableHead>Jan</TableHead>
                <TableHead>Feb</TableHead>
                <TableHead>Mar</TableHead>
                <TableHead>Apr</TableHead>
                <TableHead>Mei</TableHead>
                <TableHead>Jun</TableHead>
                <TableHead>Jul</TableHead>
                <TableHead>Agt</TableHead>
                <TableHead>Sep</TableHead>
                <TableHead>Okt</TableHead>
                <TableHead>Nov</TableHead>
                <TableHead>Des</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-8 text-muted-foreground">
                    {stockData.length === 0 
                      ? "Belum ada data stok bapokting" 
                      : "Tidak ada data yang sesuai dengan filter"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(item.survey_date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getCommodityName(item.commodity_id)}
                    </TableCell>
                    <TableCell>{item.store_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.january_capaian}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.february}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.march}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.april}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.may}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.june}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.july}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.august}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.september}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.october}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.november}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.december}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.operator_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockBapoktingTable;