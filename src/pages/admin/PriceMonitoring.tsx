import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, FileText, Download, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PriceMonitoring as PriceMonitoringComponent } from "@/components/PriceMonitoring";
import * as XLSX from "xlsx";

// Data stok bapokting sesuai format referensi
const generateDetailedStockData = (year: number) => {
  const commodities = [
    { id: 1, name: "Beras (kg)" },
    { id: 2, name: "Kedelai (kg)" },
    { id: 3, name: "Tepung Terigu (kg)" },
    { id: 4, name: "Gula Pasir (kg)" },
    { id: 5, name: "Minyak Goreng Curah (l)" },
    { id: 6, name: "Minyak Goreng Kemasan (l)" },
    { id: 7, name: "Telur (kg)" },
    { id: 8, name: "Garam Bata (kg)" }
  ];

  const stores = [
    "Obor",
    "Dadi Agung", 
    "Sumber Manis",
    "PO. Tani Jaya",
    "UD. Margo Rukun",
    "CV. Sinar Inti Pandawa",
    "Sumber Makmur",
    "CV. Waringin Sukses Sejahtera"
  ];

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const data = [];
  
  commodities.forEach((commodity) => {
    stores.forEach((store, storeIndex) => {
      const row = {
        id: `${commodity.id}-${storeIndex}`,
        commodityId: commodity.id,
        commodity: commodity.name,
        store: store,
        monthlyData: {}
      };
      
      months.forEach((month) => {
        // Generate realistic stock data with some variations
        const baseStock = Math.floor(Math.random() * 5000) + 100;
        const variation = Math.random() > 0.1 ? baseStock : 0; // 10% chance of no stock
        row.monthlyData[month] = variation;
      });
      
      data.push(row);
    });
  });

  return data;
};

export default function PriceMonitoring() {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + "");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear() + "");
  const { toast } = useToast();

  const stockData = generateDetailedStockData(parseInt(selectedYear));

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" }
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleExportData = () => {
    const exportData = [];
    
    stockData.forEach((row) => {
      const rowData = {
        'No': row.commodityId,
        'Komoditas': row.commodity,
        'Nama Toko Besar': row.store
      };
      
      // Add monthly data
      Object.keys(row.monthlyData).forEach((month) => {
        rowData[month] = row.monthlyData[month];
      });
      
      exportData.push(rowData);
    });
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, `Data Stok ${selectedYear}`);
    XLSX.writeFile(workbook, `Data_Stok_Bapokting_${selectedYear}.xlsx`);
    
    toast({
      title: "Export Berhasil",
      description: "Data stok berhasil diekspor ke Excel"
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Monitoring Harga</h2>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Monitoring Harga</span>
          </TabsTrigger>
          <TabsTrigger value="stock-report" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Data Stok Bapokting</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <PriceMonitoringComponent />
        </TabsContent>

        <TabsContent value="stock-report">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Data Stok Bapokting - Tingkat Toko Besar/Distributor Tahun {selectedYear}
                  </CardTitle>
                </div>
                <Button onClick={handleExportData} className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Excel</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filter Section */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter Tahun:</span>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead className="w-40">Komoditas</TableHead>
                      <TableHead className="w-48">Nama Toko Besar</TableHead>
                      <TableHead className="text-center">Jan</TableHead>
                      <TableHead className="text-center">Feb</TableHead>
                      <TableHead className="text-center">Mar</TableHead>
                      <TableHead className="text-center">Apr</TableHead>
                      <TableHead className="text-center">Mei</TableHead>
                      <TableHead className="text-center">Jun</TableHead>
                      <TableHead className="text-center">Jul</TableHead>
                      <TableHead className="text-center">Agt</TableHead>
                      <TableHead className="text-center">Sep</TableHead>
                      <TableHead className="text-center">Okt</TableHead>
                      <TableHead className="text-center">Nov</TableHead>
                      <TableHead className="text-center">Des</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{item.commodityId}</TableCell>
                        <TableCell className="font-medium">{item.commodity}</TableCell>
                        <TableCell>{item.store}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Januari']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Februari']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Maret']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['April']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Mei']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Juni']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Juli']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Agustus']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['September']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Oktober']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['November']?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-center">{item.monthlyData['Desember']?.toLocaleString() || '0'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stockData.length}</div>
                      <div className="text-sm text-muted-foreground">Total Entri Data</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Array.from(new Set(stockData.map(item => item.commodity))).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Jenis Komoditas</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Array.from(new Set(stockData.map(item => item.store))).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Toko/Distributor</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedYear}
                      </div>
                      <div className="text-sm text-muted-foreground">Tahun Laporan</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}