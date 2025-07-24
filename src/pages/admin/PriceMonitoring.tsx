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

// Data stok bapokting mock
const generateStockData = (month: number, year: number) => {
  const commodities = [
    "Garam Halus (kg)",
    "Garam Bata (kg)", 
    "Telur (kg)",
    "Gula Pasir Lokal (kg)",
    "Gula Pasir Premium (kg)",
    "Beras Medium (kg)",
    "Beras Premium (kg)",
    "Minyak Goreng Curah (Ltr)",
    "Minyak Goreng Kemasan (Ltr)",
    "Daging Sapi Has Dalam (kg)",
    "Daging Sapi Kualitas 2 (kg)",
    "Daging Ayam Ras (kg)",
    "Ikan Bandeng (kg)",
    "Ikan Tongkol (kg)",
    "Ikan Cakalang (kg)",
    "Cabai Merah Keriting (kg)",
    "Cabai Rawit Merah (kg)",
    "Bawang Merah (kg)",
    "Bawang Putih (kg)",
    "Kacang Tanah (kg)",
    "Kedelai Lokal (kg)",
    "Kedelai Impor (kg)",
    "Jagung Pipilan Kering (kg)",
    "Tepung Terigu Curah (kg)",
    "Tepung Terigu Kemasan (kg)"
  ];

  const locations = [
    "Pasar Sentral Gorontalo",
    "Pasar Sentral Limboto", 
    "Pasar Sentral Marisa",
    "Pasar Sentral Kwandang",
    "Pasar Sentral Bone Bolango",
    "Pasar Sentral Tilamuta"
  ];

  return commodities.map((commodity, index) => ({
    id: index + 1,
    commodity,
    location: locations[Math.floor(Math.random() * locations.length)],
    stock: Math.floor(Math.random() * 1000) + 100,
    unit: "kg",
    lastUpdate: `${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 28) + 1}`,
    status: Math.random() > 0.2 ? "Tersedia" : "Terbatas"
  }));
};

export default function PriceMonitoring() {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + "");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear() + "");
  const { toast } = useToast();

  const stockData = generateStockData(parseInt(selectedMonth), parseInt(selectedYear));

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
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(stockData.map(item => ({
      'Komoditas': item.commodity,
      'Lokasi': item.location,
      'Stok': item.stock,
      'Satuan': item.unit,
      'Terakhir Update': item.lastUpdate,
      'Status': item.status
    })));
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Stok Bapokting');
    XLSX.writeFile(workbook, `Data_Stok_Bapokting_${selectedMonth}_${selectedYear}.xlsx`);
    
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
                    Data Stok Bapokting
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
                  <span className="text-sm font-medium">Filter Waktu:</span>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead>Terakhir Update</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.commodity}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.stock.toLocaleString()}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.lastUpdate}</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'Tersedia' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stockData.length}</div>
                      <div className="text-sm text-muted-foreground">Total Komoditas</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stockData.filter(item => item.status === 'Tersedia').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Stok Tersedia</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {stockData.filter(item => item.status === 'Terbatas').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Stok Terbatas</div>
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