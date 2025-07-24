import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Upload, Filter, BarChart3, Code, Copy, Eye, Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PriceMonitoring } from "@/components/PriceMonitoring";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Daftar semua komoditas bapokting
const commodities = [
  "Garam Halus (kg)",
  "Garam Bata (kg)", 
  "Telur (kg)",
  "Minyak Goreng Kemasan (liter)",
  "Minyak Goreng Curah (liter)",
  "Gula Pasir (kg)",
  "Tepung Terigu (kg)",
  "Kedelai (kg)",
  "Beras (kg)"
];

// Daftar toko besar
const stores = [
  "CV. Sinar Inti Pandawa",
  "Dadi Agung", 
  "Margo Rukun",
  "Obor",
  "PO. Tani Jaya",
  "TB. Griya Kita Kaloka",
  "TB. Jetis",
  "TB. Manah Asri",
  "Sumber Makmur",
  "Sumber Manis",
  "Waringin Sukses Sejati"
];

// Interface untuk data stok
interface StockData {
  storeName: string;
  commodity: string;
  january: number;
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
}

// Interface untuk akumulasi stok
interface AccumulatedStock {
  commodity: string;
  january: number;
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
  total: number;
}

// Generate complete stock data untuk semua toko dan semua komoditas
const generateCompleteStockData = (): StockData[] => {
  const data: StockData[] = [];
  
  stores.forEach(store => {
    commodities.forEach(commodity => {
      // Generate random but realistic stock numbers
      const baseStock = commodity.includes("Beras") ? 1200 : 
                       commodity.includes("Gula") ? 600 :
                       commodity.includes("Minyak") ? 400 :
                       commodity.includes("Telur") ? 300 :
                       commodity.includes("Tepung") ? 350 :
                       commodity.includes("Kedelai") ? 250 :
                       200; // untuk garam
      
      data.push({
        storeName: store,
        commodity: commodity,
        january: Math.floor(baseStock + Math.random() * 200 - 100),
        february: Math.floor(baseStock + Math.random() * 200 - 100),
        march: Math.floor(baseStock + Math.random() * 200 - 100),
        april: Math.floor(baseStock + Math.random() * 200 - 100),
        may: Math.floor(baseStock + Math.random() * 200 - 100),
        june: Math.floor(baseStock + Math.random() * 200 - 100),
        july: Math.floor(baseStock + Math.random() * 200 - 100),
        august: Math.floor(baseStock + Math.random() * 200 - 100),
        september: Math.floor(baseStock + Math.random() * 200 - 100),
        october: Math.floor(baseStock + Math.random() * 200 - 100),
        november: Math.floor(baseStock + Math.random() * 200 - 100),
        december: Math.floor(baseStock + Math.random() * 200 - 100),
      });
    });
  });
  
  return data;
};

const Reports = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stockData, setStockData] = useState<StockData[]>(generateCompleteStockData());
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data berdasarkan pilihan
  const filteredData = stockData.filter(item => {
    const matchesStore = selectedStore === "all" || item.storeName === selectedStore;
    const matchesCommodity = selectedCommodity === "all" || item.commodity === selectedCommodity;
    const matchesSearch = item.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStore && matchesCommodity && matchesSearch;
  });

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const monthKeys = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ] as const;

  // Hitung akumulasi stok per komoditas
  const calculateAccumulatedStock = (): AccumulatedStock[] => {
    const accumulated: { [key: string]: AccumulatedStock } = {};
    
    commodities.forEach(commodity => {
      accumulated[commodity] = {
        commodity,
        january: 0, february: 0, march: 0, april: 0, may: 0, june: 0,
        july: 0, august: 0, september: 0, october: 0, november: 0, december: 0,
        total: 0
      };
    });

    stockData.forEach(item => {
      const acc = accumulated[item.commodity];
      if (acc) {
        monthKeys.forEach(monthKey => {
          acc[monthKey] += item[monthKey];
        });
      }
    });

    // Hitung total tahunan
    Object.values(accumulated).forEach(item => {
      item.total = monthKeys.reduce((sum, monthKey) => sum + item[monthKey], 0);
    });

    return Object.values(accumulated);
  };

  // Export ke Excel
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Sheet 1: Data detail per toko
      const detailData = filteredData.map(row => ({
        "Nama Toko": row.storeName,
        "Komoditas": row.commodity,
        "Januari": row.january,
        "Februari": row.february,
        "Maret": row.march,
        "April": row.april,
        "Mei": row.may,
        "Juni": row.june,
        "Juli": row.july,
        "Agustus": row.august,
        "September": row.september,
        "Oktober": row.october,
        "November": row.november,
        "Desember": row.december
      }));
      
      const ws1 = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(wb, ws1, "Data Detail");
      
      // Sheet 2: Data akumulasi
      const accumulatedData = calculateAccumulatedStock().map(row => ({
        "Komoditas": row.commodity,
        "Januari": row.january,
        "Februari": row.february, 
        "Maret": row.march,
        "April": row.april,
        "Mei": row.may,
        "Juni": row.june,
        "Juli": row.july,
        "Agustus": row.august,
        "September": row.september,
        "Oktober": row.october,
        "November": row.november,
        "Desember": row.december,
        "Total Tahunan": row.total
      }));
      
      const ws2 = XLSX.utils.json_to_sheet(accumulatedData);
      XLSX.utils.book_append_sheet(wb, ws2, "Data Akumulasi");
      
      XLSX.writeFile(wb, "laporan-stok-bapokting.xlsx");
      
      toast({
        title: "Export Berhasil",
        description: "File Excel berhasil diunduh",
      });
    } catch (error) {
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat membuat file Excel",
        variant: "destructive",
      });
    }
  };

  // Export ke PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      doc.setFontSize(18);
      doc.text("Laporan Stok Bapokting Kota Salatiga", 15, 20);
      
      doc.setFontSize(12);
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 15, 30);
      
      // Table untuk data detail (hanya menampilkan beberapa kolom karena keterbatasan space)
      const tableColumns = ["Nama Toko", "Komoditas", "Jan", "Feb", "Mar", "Apr", "Total Q1"];
      const tableRows = filteredData.slice(0, 20).map(row => [
        row.storeName,
        row.commodity,
        row.january.toString(),
        row.february.toString(),
        row.march.toString(),
        row.april.toString(),
        (row.january + row.february + row.march + row.april).toString()
      ]);
      
      (doc as any).autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
        margin: { top: 40 },
      });
      
      // Halaman baru untuk data akumulasi
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Data Akumulasi Stok per Komoditas", 15, 20);
      
      const accData = calculateAccumulatedStock();
      const accColumns = ["Komoditas", "Jan", "Feb", "Mar", "Q1", "Apr", "Mei", "Jun", "Q2"];
      const accRows = accData.map(row => [
        row.commodity,
        row.january.toString(),
        row.february.toString(), 
        row.march.toString(),
        (row.january + row.february + row.march).toString(),
        row.april.toString(),
        row.may.toString(),
        row.june.toString(),
        (row.april + row.may + row.june).toString()
      ]);
      
      (doc as any).autoTable({
        head: [accColumns],
        body: accRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [40, 167, 69] },
      });
      
      doc.save("laporan-stok-bapokting.pdf");
      
      toast({
        title: "Export Berhasil",
        description: "File PDF berhasil diunduh",
      });
    } catch (error) {
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat membuat file PDF",
        variant: "destructive",
      });
    }
  };

  // Import dari Excel
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Convert imported data to StockData format
        const importedData: StockData[] = jsonData.map((row: any) => ({
          storeName: row["Nama Toko"] || "",
          commodity: row["Komoditas"] || "",
          january: parseInt(row["Januari"]) || 0,
          february: parseInt(row["Februari"]) || 0,
          march: parseInt(row["Maret"]) || 0,
          april: parseInt(row["April"]) || 0,
          may: parseInt(row["Mei"]) || 0,
          june: parseInt(row["Juni"]) || 0,
          july: parseInt(row["Juli"]) || 0,
          august: parseInt(row["Agustus"]) || 0,
          september: parseInt(row["September"]) || 0,
          october: parseInt(row["Oktober"]) || 0,
          november: parseInt(row["November"]) || 0,
          december: parseInt(row["Desember"]) || 0,
        }));
        
        setStockData(importedData);
        
        toast({
          title: "Import Berhasil",
          description: `Berhasil mengimport ${importedData.length} data stok`,
        });
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast({
        title: "Import Gagal",
        description: "Terjadi kesalahan saat membaca file Excel",
        variant: "destructive",
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const accumulatedStock = calculateAccumulatedStock();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Stok Bapokting</h1>
          <p className="text-muted-foreground">Laporan data stok bahan pokok dan penting Kota Salatiga</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
          </Button>
          <Button onClick={handleExportExcel} variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </Button>
          <Button onClick={handleExportPDF} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImportExcel}
        className="hidden"
      />

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Data
          </CardTitle>
          <CardDescription>
            Filter laporan berdasarkan toko, komoditas, bulan, atau pencarian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Toko</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih toko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Toko</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store} value={store}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Komoditas</label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih komoditas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Komoditas</SelectItem>
                  {commodities.map((commodity) => (
                    <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bulan</SelectItem>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={monthKeys[index]}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pencarian</label>
              <Input
                placeholder="Cari toko atau komoditas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Monitoring Harga</span>
          </TabsTrigger>
          <TabsTrigger value="detail" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Data Detail per Toko</span>
          </TabsTrigger>
          <TabsTrigger value="accumulated" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Akumulasi Stok</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Dokumentasi API</span>
          </TabsTrigger>
        </TabsList>

        {/* Price Monitoring Tab */}
        <TabsContent value="monitoring">
          <PriceMonitoring />
        </TabsContent>

        {/* Detail Data Table */}
        <TabsContent value="detail">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Data Stok Detail per Toko
              </CardTitle>
              <CardDescription>
                Menampilkan {filteredData.length} data stok dari total {stockData.length} data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Nama Toko</TableHead>
                      <TableHead className="min-w-[180px]">Komoditas</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[80px]">
                          {month}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.storeName}</TableCell>
                        <TableCell>{row.commodity}</TableCell>
                        {monthKeys.map((monthKey) => (
                          <TableCell key={monthKey} className="text-center">
                            {row[monthKey].toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                          Tidak ada data yang sesuai dengan filter
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accumulated Stock Table */}
        <TabsContent value="accumulated">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Akumulasi Stok per Komoditas
              </CardTitle>
              <CardDescription>
                Total stok semua komoditas dari seluruh toko besar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Komoditas</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[80px]">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[100px] font-bold">Total Tahunan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accumulatedStock.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.commodity}</TableCell>
                        {monthKeys.map((monthKey) => (
                          <TableCell key={monthKey} className="text-center">
                            {row[monthKey].toLocaleString()}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold">
                          {row.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Documentation Tab */}
        <TabsContent value="api">
          <div className="space-y-6">
            {/* API Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Dokumentasi API Komoditas
                </CardTitle>
                <CardDescription>
                  REST API untuk mengakses data harga komoditas dan survey pasar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Base URL</h4>
                    <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      https://snfgnsiyieognthvpyto.supabase.co/functions/v1/commodity-api
                    </code>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Format Response</h5>
                      <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
{`{
  "success": true,
  "data": [...],
  "count": 100,
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                      </pre>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Authentication</h5>
                      <p className="text-sm text-muted-foreground mb-2">Header yang diperlukan:</p>
                      <code className="text-xs bg-gray-100 p-2 rounded block">
                        apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endpoints Documentation */}
            <div className="grid gap-6">
              {/* GET Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                    /prices
                  </CardTitle>
                  <CardDescription>
                    Mendapatkan data survey harga komoditas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Query Parameters</h5>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">market_id</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">ID pasar</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">commodity_id</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">ID komoditas</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">date_from</code>
                        <span>date</span>
                        <span className="text-muted-foreground">Tanggal mulai (YYYY-MM-DD)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">date_to</code>
                        <span>date</span>
                        <span className="text-muted-foreground">Tanggal akhir (YYYY-MM-DD)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">limit</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">Batas data (default: 100)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Contoh Request</h5>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X GET "https://snfgnsiyieognthvpyto.supabase.co/functions/v1/commodity-api/prices?market_id=1&limit=10" \\
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
                      </pre>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute top-2 right-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`curl -X GET "https://snfgnsiyieognthvpyto.supabase.co/functions/v1/commodity-api/prices?market_id=1&limit=10" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`);
                          toast({ title: "Copied!", description: "Request example copied to clipboard" });
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* POST Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                    /prices
                  </CardTitle>
                  <CardDescription>
                    Menambahkan data survey harga baru
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Request Body</h5>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "market_id": 1,
  "commodity_id": 5,
  "price": 35000,
  "stock_status": "available",
  "quality": "good",
  "survey_date": "2024-01-15",
  "operator_name": "Admin",
  "notes": "Kondisi baik"
}`}
                    </pre>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Nilai yang Valid</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>stock_status:</strong>
                        <ul className="list-disc list-inside text-muted-foreground">
                          <li>available</li>
                          <li>limited</li>
                          <li>unavailable</li>
                        </ul>
                      </div>
                      <div>
                        <strong>quality:</strong>
                        <ul className="list-disc list-inside text-muted-foreground">
                          <li>excellent</li>
                          <li>good</li>
                          <li>average</li>
                          <li>poor</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GET Latest */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                    /latest
                  </CardTitle>
                  <CardDescription>
                    Mendapatkan harga terbaru per komoditas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Query Parameters</h5>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">market_id</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">Filter berdasarkan pasar (opsional)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GET Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                    /stats
                  </CardTitle>
                  <CardDescription>
                    Mendapatkan statistik harga komoditas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Query Parameters</h5>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">commodity_id</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">ID komoditas (opsional)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">market_id</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">ID pasar (opsional)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">period</code>
                        <span>integer</span>
                        <span className="text-muted-foreground">Periode hari (default: 30)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Response</h5>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "count": 45,
    "avg_price": 34500,
    "min_price": 30000,
    "max_price": 40000,
    "period_days": 30
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Codes */}
            <Card>
              <CardHeader>
                <CardTitle>Error Codes</CardTitle>
                <CardDescription>
                  Kode error yang mungkin dikembalikan oleh API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <code className="bg-red-100 text-red-800 px-2 py-1 rounded">400</code>
                    <span className="font-medium">Bad Request</span>
                    <span className="text-muted-foreground">Parameter tidak valid</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">401</code>
                    <span className="font-medium">Unauthorized</span>
                    <span className="text-muted-foreground">API key tidak valid</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded">404</code>
                    <span className="font-medium">Not Found</span>
                    <span className="text-muted-foreground">Endpoint tidak ditemukan</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <code className="bg-red-100 text-red-800 px-2 py-1 rounded">500</code>
                    <span className="font-medium">Server Error</span>
                    <span className="text-muted-foreground">Kesalahan server internal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;