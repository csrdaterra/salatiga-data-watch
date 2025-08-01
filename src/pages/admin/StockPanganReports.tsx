import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { getLargeStoreNames } from "@/stores/largeStoreStore";

const stockPanganCommodities = [
  "Beras",
  "Gula Pasir",
  "Minyak Goreng",
  "Tepung Terigu",
  "Daging Sapi",
  "Daging Ayam",
  "Telur Ayam",
  "Bawang Merah",
  "Cabai Merah"
];

// Sample data for demonstration
const sampleReports = [
  {
    id: 1,
    date: "2024-01-15",
    store: "CV. Sinar Inti Pandawa",
    commodity: "Beras",
    stock: 150,
    price: 12000,
    trend: "up"
  },
  {
    id: 2,
    date: "2024-01-15",
    store: "Hypermarket Global",
    commodity: "Minyak Goreng",
    stock: 75,
    price: 18000,
    trend: "down"
  },
  {
    id: 3,
    date: "2024-01-14",
    store: "Toko Sari Rejo",
    commodity: "Gula Pasir",
    stock: 200,
    price: 15000,
    trend: "up"
  }
];

export default function StockPanganReports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [filteredReports, setFilteredReports] = useState(sampleReports);

  const storeNames = getLargeStoreNames();

  const handleApplyFilter = () => {
    let filtered = [...sampleReports];
    
    if (selectedStore) {
      filtered = filtered.filter(report => report.store === selectedStore);
    }
    
    if (selectedCommodity) {
      filtered = filtered.filter(report => report.commodity === selectedCommodity);
    }
    
    setFilteredReports(filtered);
  };

  const handleExport = () => {
    // Implementation for export functionality
    console.log("Exporting reports...");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan Stok Pangan</h1>
        <p className="text-muted-foreground">
          Laporan stok pangan dengan filter berdasarkan periode, komoditas, dan toko
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
          <CardDescription>
            Atur filter untuk menyesuaikan laporan sesuai kebutuhan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Periode</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Toko Besar</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua toko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Toko</SelectItem>
                  {storeNames.map((store) => (
                    <SelectItem key={store} value={store}>
                      {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Komoditas</label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua komoditas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Komoditas</SelectItem>
                  {stockPanganCommodities.map((commodity) => (
                    <SelectItem key={commodity} value={commodity}>
                      {commodity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rentang Tanggal</label>
              <CalendarDateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApplyFilter} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Terapkan Filter
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Stok Pangan</CardTitle>
          <CardDescription>
            Menampilkan {filteredReports.length} data stok pangan berdasarkan filter yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Toko</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Stok (kg)</TableHead>
                <TableHead>Harga (Rp)</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{format(new Date(report.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="font-medium">{report.store}</TableCell>
                  <TableCell>{report.commodity}</TableCell>
                  <TableCell>{report.stock.toLocaleString()}</TableCell>
                  <TableCell>Rp {report.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={report.trend === "up" ? "default" : "destructive"}>
                      {report.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {report.trend === "up" ? "Naik" : "Turun"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReports.length}</div>
            <p className="text-xs text-muted-foreground">
              Data stok sesuai filter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Stok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(filteredReports.reduce((sum, r) => sum + r.stock, 0) / filteredReports.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              kg per komoditas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend Positif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredReports.filter(r => r.trend === "up").length}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {filteredReports.length} data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}