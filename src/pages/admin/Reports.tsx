import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Filter } from "lucide-react";

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

// Data contoh stok bapokting
const stockData: StockData[] = [
  {
    storeName: "CV. Sinar Inti Pandawa",
    commodity: "Beras (kg)",
    january: 1500, february: 1200, march: 1800, april: 1400, may: 1600, june: 1300,
    july: 1700, august: 1500, september: 1900, october: 1600, november: 1400, december: 1800
  },
  {
    storeName: "CV. Sinar Inti Pandawa",
    commodity: "Gula Pasir (kg)",
    january: 800, february: 600, march: 900, april: 700, may: 850, june: 650,
    july: 950, august: 800, september: 1000, october: 850, november: 700, december: 900
  },
  {
    storeName: "CV. Sinar Inti Pandawa",
    commodity: "Minyak Goreng Kemasan (liter)",
    january: 500, february: 400, march: 600, april: 450, may: 550, june: 400,
    july: 650, august: 500, september: 700, october: 550, november: 450, december: 600
  },
  {
    storeName: "Dadi Agung",
    commodity: "Beras (kg)",
    january: 1200, february: 1000, march: 1400, april: 1100, may: 1300, june: 1000,
    july: 1500, august: 1200, september: 1600, october: 1300, november: 1100, december: 1400
  },
  {
    storeName: "Dadi Agung",
    commodity: "Gula Pasir (kg)",
    january: 600, february: 500, march: 700, april: 550, may: 650, june: 500,
    july: 750, august: 600, september: 800, october: 650, november: 550, december: 700
  },
  {
    storeName: "Margo Rukun",
    commodity: "Beras (kg)",
    january: 1000, february: 800, march: 1200, april: 900, may: 1100, june: 800,
    july: 1300, august: 1000, september: 1400, october: 1100, november: 900, december: 1200
  },
  {
    storeName: "Obor",
    commodity: "Telur (kg)",
    january: 300, february: 250, march: 350, april: 280, may: 320, june: 250,
    july: 380, august: 300, september: 400, october: 320, november: 280, december: 350
  },
  {
    storeName: "PO. Tani Jaya",
    commodity: "Tepung Terigu (kg)",
    january: 400, february: 350, march: 450, april: 380, may: 420, june: 350,
    july: 480, august: 400, september: 500, october: 420, november: 380, december: 450
  }
];

const Reports = () => {
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data berdasarkan pilihan
  const filteredData = stockData.filter(item => {
    const matchesStore = selectedStore === "all" || item.storeName === selectedStore;
    const matchesCommodity = selectedCommodity === "all" || item.commodity === selectedCommodity;
    const matchesSearch = item.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStore && matchesCommodity && matchesSearch;
  });

  // Get unique stores and commodities for filter options
  const uniqueStores = [...new Set(stockData.map(item => item.storeName))];
  const uniqueCommodities = [...new Set(stockData.map(item => item.commodity))];

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const monthKeys = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ] as const;

  const handleExport = () => {
    // Simple CSV export functionality
    const headers = ["Nama Toko", "Komoditas", ...months];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        row.storeName,
        row.commodity,
        ...monthKeys.map(key => row[key])
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "laporan-stok-bapokting.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Stok Bapokting</h1>
          <p className="text-muted-foreground">Laporan data stok bahan pokok dan penting Kota Salatiga</p>
        </div>
        <Button onClick={handleExport} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Data
          </CardTitle>
          <CardDescription>
            Filter laporan berdasarkan toko, komoditas, atau pencarian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Toko</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih toko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Toko</SelectItem>
                  {uniqueStores.map((store) => (
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
                  {uniqueCommodities.map((commodity) => (
                    <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
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

      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Data Stok Bulanan
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
    </div>
  );
};

export default Reports;