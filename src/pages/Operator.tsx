import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PlusCircle, Save, FileText, TrendingUp, Calendar, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getCommodities, getMarketCommodities, getMarketCommoditiesByMarket } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";

interface PriceSurvey {
  id: number;
  marketId: number;
  commodityId: number;
  price: number;
  stock: 'available' | 'limited' | 'unavailable';
  quality: 'excellent' | 'good' | 'average' | 'poor';
  date: string;
  operator: string;
  notes?: string;
}

interface ReportData {
  date: string;
  commodityName: string;
  marketName: string;
  price: number;
  avgPrice: number;
  priceChange: number;
}

// Generate sample survey data
const generateSampleSurveys = (): PriceSurvey[] => {
  const commodities = getCommodities();
  const markets = getMarkets();
  const data: PriceSurvey[] = [];
  let id = 1;

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    markets.forEach(market => {
      // Randomly select 60% of commodities for each market each day
      const selectedCommodities = commodities.filter(() => Math.random() > 0.4);
      
      selectedCommodities.forEach(commodity => {
        const basePrice = commodity.category === "beras" ? 12000 :
                         commodity.category === "daging" ? 45000 :
                         commodity.category === "cabai" ? 35000 :
                         commodity.category === "minyak goreng" ? 18000 :
                         commodity.category === "gula pasir" ? 15000 :
                         commodity.category === "tepung terigu" ? 12000 :
                         commodity.category === "bawang" ? 25000 :
                         15000;

        data.push({
          id: id++,
          marketId: market.id,
          commodityId: commodity.id,
          price: Math.floor(basePrice + (Math.random() - 0.5) * basePrice * 0.3),
          stock: ['available', 'limited', 'unavailable'][Math.floor(Math.random() * 3)] as any,
          quality: ['excellent', 'good', 'average', 'poor'][Math.floor(Math.random() * 4)] as any,
          date: date.toISOString().split('T')[0],
          operator: `Operator ${market.name}`,
          notes: Math.random() > 0.7 ? "Stok menipis" : undefined
        });
      });
    });
  }

  return data;
};

function OperatorPage() {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<PriceSurvey[]>(generateSampleSurveys());
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [quality, setQuality] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [reportPeriod, setReportPeriod] = useState<string>("daily");
  const [reportMarket, setReportMarket] = useState<string>("all");

  const allCommodities = getCommodities();
  const markets = getMarkets();

  // Filter commodities based on selected market
  const availableCommodities = selectedMarket 
    ? (() => {
        const marketCommodities = getMarketCommoditiesByMarket(parseInt(selectedMarket));
        return allCommodities.filter(commodity => 
          marketCommodities.some(mc => mc.commodityId === commodity.id && mc.availability)
        );
      })()
    : [];

  // Reset commodity selection when market changes
  const handleMarketChange = (marketId: string) => {
    setSelectedMarket(marketId);
    setSelectedCommodity(""); // Reset commodity selection
  };

  const handleSubmitSurvey = () => {
    if (!selectedMarket || !selectedCommodity || !price || !stock || !quality) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const newSurvey: PriceSurvey = {
      id: Date.now(),
      marketId: parseInt(selectedMarket),
      commodityId: parseInt(selectedCommodity),
      price: parseInt(price),
      stock: stock as any,
      quality: quality as any,
      date: new Date().toISOString().split('T')[0],
      operator: "Operator Aktif",
      notes: notes || undefined
    };

    // Add new survey and update state
    const updatedSurveys = [newSurvey, ...surveys];
    setSurveys(updatedSurveys);
    
    // Reset form but keep market selection
    setSelectedCommodity("");
    setPrice("");
    setStock("");
    setQuality("");
    setNotes("");

    // Show success message with real-time update info
    const commodity = allCommodities.find(c => c.id === parseInt(selectedCommodity));
    const market = markets.find(m => m.id === parseInt(selectedMarket));
    
    toast({
      title: "Survey Berhasil Disimpan",
      description: `Data harga ${commodity?.name} di ${market?.name} telah diperbarui secara real-time`,
    });
  };

  // Prepare report data based on period
  const getReportData = () => {
    const filteredSurveys = surveys.filter(survey => {
      const matchesMarket = reportMarket === "all" || survey.marketId.toString() === reportMarket;
      return matchesMarket;
    });

    const groupedData: { [key: string]: PriceSurvey[] } = {};
    
    filteredSurveys.forEach(survey => {
      const date = new Date(survey.date);
      let key = "";
      
      if (reportPeriod === "daily") {
        key = survey.date;
      } else if (reportPeriod === "monthly") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (reportPeriod === "yearly") {
        key = date.getFullYear().toString();
      }
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(survey);
    });

    return Object.entries(groupedData).map(([period, periodSurveys]) => {
      const commodityPrices: { [commodityId: number]: number[] } = {};
      
      periodSurveys.forEach(survey => {
        if (!commodityPrices[survey.commodityId]) {
          commodityPrices[survey.commodityId] = [];
        }
        commodityPrices[survey.commodityId].push(survey.price);
      });

      const commodityData = Object.entries(commodityPrices).map(([commodityId, prices]) => {
        const commodity = allCommodities.find(c => c.id === parseInt(commodityId));
        const avgPrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
        
        return {
          commodityId: parseInt(commodityId),
          commodityName: commodity?.name || 'Unknown',
          avgPrice,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          count: prices.length
        };
      });

      return {
        period,
        commodities: commodityData,
        totalSurveys: periodSurveys.length
      };
    }).sort((a, b) => b.period.localeCompare(a.period));
  };

  const reportData = getReportData();

  // Prepare chart data
  const chartData = reportData.slice(0, 10).reverse().map(item => {
    const data: any = { period: item.period };
    item.commodities.slice(0, 5).forEach(commodity => {
      data[commodity.commodityName.substring(0, 15)] = commodity.avgPrice;
    });
    return data;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portal Operator Pasar</h1>
          <p className="text-muted-foreground">Input survey harga komoditas dan laporan analitik</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Mode Operator</span>
        </Badge>
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input" className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4" />
            <span>Input Survey Harga</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Laporan & Analitik</span>
          </TabsTrigger>
        </TabsList>

        {/* Input Survey Tab */}
        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Form Survey Harga Komoditas
              </CardTitle>
              <CardDescription>
                Input data harga komoditas berdasarkan survey harian di pasar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="market">Pasar *</Label>
                  <Select value={selectedMarket} onValueChange={handleMarketChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pasar" />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map((market) => (
                        <SelectItem key={market.id} value={market.id.toString()}>
                          {market.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commodity">Komoditas * {selectedMarket && `(${availableCommodities.length} tersedia)`}</Label>
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity} disabled={!selectedMarket}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedMarket ? "Pilih komoditas yang tersedia" : "Pilih pasar terlebih dahulu"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCommodities.map((commodity) => (
                        <SelectItem key={commodity.id} value={commodity.id.toString()}>
                          {commodity.name} ({commodity.unit})
                        </SelectItem>
                      ))}
                      {selectedMarket && availableCommodities.length === 0 && (
                        <SelectItem value="" disabled>Tidak ada komoditas tersedia</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Masukkan harga"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Ketersediaan Stok</Label>
                  <Select value={stock} onValueChange={setStock}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ketersediaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Tersedia</SelectItem>
                      <SelectItem value="limited">Terbatas</SelectItem>
                      <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Kualitas</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kualitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Sangat Baik</SelectItem>
                      <SelectItem value="good">Baik</SelectItem>
                      <SelectItem value="average">Sedang</SelectItem>
                      <SelectItem value="poor">Kurang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tambahkan catatan khusus..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSubmitSurvey} className="w-full flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Simpan Survey Harga</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Surveys */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Terbaru</CardTitle>
              <CardDescription>10 data survey terakhir yang diinput</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pasar</TableHead>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Kualitas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.slice(0, 10).map((survey) => {
                      const market = markets.find(m => m.id === survey.marketId);
                      const commodity = allCommodities.find(c => c.id === survey.commodityId);
                      return (
                        <TableRow key={survey.id}>
                          <TableCell>{new Date(survey.date).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>{market?.name}</TableCell>
                          <TableCell>{commodity?.name}</TableCell>
                          <TableCell className="font-medium">Rp {survey.price.toLocaleString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge variant={
                              survey.stock === 'available' ? 'default' :
                              survey.stock === 'limited' ? 'secondary' : 'destructive'
                            }>
                              {survey.stock === 'available' ? 'Tersedia' :
                               survey.stock === 'limited' ? 'Terbatas' : 'Habis'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {survey.quality === 'excellent' ? 'Sangat Baik' :
                               survey.quality === 'good' ? 'Baik' :
                               survey.quality === 'average' ? 'Sedang' : 'Kurang'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Report Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Filter Laporan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Periode Laporan</Label>
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pasar</Label>
                  <Select value={reportMarket} onValueChange={setReportMarket}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Pasar</SelectItem>
                      {markets.map((market) => (
                        <SelectItem key={market.id} value={market.id.toString()}>
                          {market.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Tren Harga Komoditas
              </CardTitle>
              <CardDescription>
                Grafik pergerakan harga rata-rata periode {reportPeriod === 'daily' ? 'harian' : reportPeriod === 'monthly' ? 'bulanan' : 'tahunan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`Rp ${value.toLocaleString('id-ID')}`, name]}
                    />
                    <Legend />
                    {chartData.length > 0 && Object.keys(chartData[0])
                      .filter(key => key !== 'period')
                      .slice(0, 5)
                      .map((key, index) => (
                        <Line 
                          key={key}
                          type="monotone" 
                          dataKey={key} 
                          stroke={`hsl(${index * 60}, 70%, 50%)`}
                          strokeWidth={2}
                        />
                      ))
                    }
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Report Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Laporan</CardTitle>
              <CardDescription>
                Data statistik periode {reportPeriod === 'daily' ? 'harian' : reportPeriod === 'monthly' ? 'bulanan' : 'tahunan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportData.slice(0, 5).map((period) => (
                  <div key={period.period} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Periode: {new Date(period.period + '-01').toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: reportPeriod === 'yearly' ? undefined : 'long',
                          day: reportPeriod === 'daily' ? 'numeric' : undefined
                        })}
                      </h3>
                      <Badge variant="outline">{period.totalSurveys} survey</Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Komoditas</TableHead>
                            <TableHead>Harga Rata-rata</TableHead>
                            <TableHead>Harga Terendah</TableHead>
                            <TableHead>Harga Tertinggi</TableHead>
                            <TableHead>Jumlah Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {period.commodities.slice(0, 5).map((commodity) => (
                            <TableRow key={commodity.commodityId}>
                              <TableCell className="font-medium">{commodity.commodityName}</TableCell>
                              <TableCell>Rp {commodity.avgPrice.toLocaleString('id-ID')}</TableCell>
                              <TableCell>Rp {commodity.minPrice.toLocaleString('id-ID')}</TableCell>
                              <TableCell>Rp {commodity.maxPrice.toLocaleString('id-ID')}</TableCell>
                              <TableCell>{commodity.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OperatorPage;