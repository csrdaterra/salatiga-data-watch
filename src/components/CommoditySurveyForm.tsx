import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, MapPin, DollarSign, RefreshCw, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Daftar 50 item Kepokmas
const kepokmasItems = [
  { id: 1, name: "Beras Premium", unit: "kg" },
  { id: 2, name: "Beras Medium", unit: "kg" },
  { id: 3, name: "Beras IR 64", unit: "kg" },
  { id: 4, name: "Gula Pasir", unit: "kg" },
  { id: 5, name: "Gula Merah", unit: "kg" },
  { id: 6, name: "Minyak Goreng Kemasan", unit: "liter" },
  { id: 7, name: "Minyak Goreng Curah", unit: "liter" },
  { id: 8, name: "Minyak Kelapa Sawit", unit: "liter" },
  { id: 9, name: "Tepung Terigu Protein Tinggi", unit: "kg" },
  { id: 10, name: "Tepung Terigu Protein Sedang", unit: "kg" },
  { id: 11, name: "Daging Sapi Murni", unit: "kg" },
  { id: 12, name: "Daging Sapi Has Dalam", unit: "kg" },
  { id: 13, name: "Daging Ayam Ras", unit: "kg" },
  { id: 14, name: "Daging Ayam Kampung", unit: "kg" },
  { id: 15, name: "Telur Ayam Ras", unit: "kg" },
  { id: 16, name: "Telur Ayam Kampung", unit: "kg" },
  { id: 17, name: "Ikan Bandeng", unit: "kg" },
  { id: 18, name: "Ikan Tongkol", unit: "kg" },
  { id: 19, name: "Ikan Teri", unit: "kg" },
  { id: 20, name: "Ikan Kembung", unit: "kg" },
  { id: 21, name: "Cabai Merah Besar", unit: "kg" },
  { id: 22, name: "Cabai Merah Keriting", unit: "kg" },
  { id: 23, name: "Cabai Rawit Merah", unit: "kg" },
  { id: 24, name: "Cabai Rawit Hijau", unit: "kg" },
  { id: 25, name: "Bawang Merah", unit: "kg" },
  { id: 26, name: "Bawang Putih", unit: "kg" },
  { id: 27, name: "Bawang Bombay", unit: "kg" },
  { id: 28, name: "Tomat", unit: "kg" },
  { id: 29, name: "Kentang", unit: "kg" },
  { id: 30, name: "Wortel", unit: "kg" },
  { id: 31, name: "Kol/Kubis", unit: "kg" },
  { id: 32, name: "Sawi Hijau", unit: "kg" },
  { id: 33, name: "Kangkung", unit: "ikat" },
  { id: 34, name: "Bayam", unit: "ikat" },
  { id: 35, name: "Kacang Panjang", unit: "kg" },
  { id: 36, name: "Kacang Tanah", unit: "kg" },
  { id: 37, name: "Kedelai", unit: "kg" },
  { id: 38, name: "Tahu", unit: "potong" },
  { id: 39, name: "Tempe", unit: "potong" },
  { id: 40, name: "Susu Kental Manis", unit: "kaleng" },
  { id: 41, name: "Susu Bubuk", unit: "kotak" },
  { id: 42, name: "Mentega", unit: "kg" },
  { id: 43, name: "Garam", unit: "kg" },
  { id: 44, name: "Merica", unit: "kg" },
  { id: 45, name: "Kecap Manis", unit: "botol" },
  { id: 46, name: "Kecap Asin", unit: "botol" },
  { id: 47, name: "Saus Tomat", unit: "botol" },
  { id: 48, name: "Mie Instan", unit: "bungkus" },
  { id: 49, name: "Roti Tawar", unit: "bungkus" },
  { id: 50, name: "Kerupuk", unit: "kg" }
];

interface CommodityPriceInput {
  commodityId: number;
  commodityName: string;
  unit: string;
  price: string;
  stock: string;
  quality: string;
  notes: string;
}

interface PriceSurveyData {
  id?: string;
  market_id: number;
  commodity_id: number;
  price: number;
  stock_status: 'available' | 'limited' | 'unavailable';
  quality: 'excellent' | 'good' | 'average' | 'poor';
  notes?: string;
  survey_date: string;
  operator_name: string;
  created_at?: string;
}

const CommoditySurveyForm = () => {
  const { toast } = useToast();
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [commodityInputs, setCommodityInputs] = useState<CommodityPriceInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSurveyDate, setLastSurveyDate] = useState<string>("");

  // Daftar pasar static (simplified untuk kepokmas)
  const markets = [
    { id: 1, name: "Pasar Beringharjo", address: "Jl. Malioboro, Yogyakarta", contact: "0274-123456" },
    { id: 2, name: "Pasar Klewer", address: "Jl. Secang, Solo", contact: "0271-234567" },
    { id: 3, name: "Pasar Gede", address: "Jl. Urip Sumoharjo, Solo", contact: "0271-345678" },
  ];

  // Initialize commodity inputs when component mounts
  useEffect(() => {
    const initialInputs: CommodityPriceInput[] = kepokmasItems.map(item => ({
      commodityId: item.id,
      commodityName: item.name,
      unit: item.unit,
      price: "",
      stock: "available", // Default to "tersedia"
      quality: "good", // Default to "baik"
      notes: ""
    }));
    
    setCommodityInputs(initialInputs);
    setLastSurveyDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Update specific commodity input
  const updateCommodityInput = (commodityId: number, field: keyof CommodityPriceInput, value: string) => {
    setCommodityInputs(prev => 
      prev.map(input => 
        input.commodityId === commodityId 
          ? { ...input, [field]: value }
          : input
      )
    );
  };

  // Check if all required fields are filled for a commodity
  const isCommodityComplete = (input: CommodityPriceInput) => {
    return input.price && input.stock && input.quality;
  };

  // Get completed commodities count
  const getCompletedCount = () => {
    return commodityInputs.filter(isCommodityComplete).length;
  };

  // Submit all commodity data
  const handleSubmitSurvey = async () => {
    if (!selectedMarket) {
      toast({
        title: "Error",
        description: "Pilih pasar terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const completedInputs = commodityInputs.filter(isCommodityComplete);
    
    if (completedInputs.length === 0) {
      toast({
        title: "Error", 
        description: "Minimal harus ada satu komoditas yang diisi lengkap",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user for authentication check
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error Autentikasi",
          description: "Anda harus login terlebih dahulu untuk menyimpan data",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare data for storage (without user_id since it's not in the schema)
      const surveyData = completedInputs.map(input => ({
        market_id: parseInt(selectedMarket),
        commodity_id: input.commodityId,
        price: parseInt(input.price),
        stock_status: input.stock as 'available' | 'limited' | 'unavailable',
        quality: input.quality as 'excellent' | 'good' | 'average' | 'poor',
        notes: input.notes || null,
        survey_date: lastSurveyDate,
        operator_name: "Operator Aktif"
      }));

      // Save to Supabase
      const { error } = await supabase
        .from('price_surveys')
        .insert(surveyData);

      if (error) throw error;

      toast({
        title: "Survey Berhasil Disimpan",
        description: `${completedInputs.length} komoditas berhasil diperbarui secara real-time`,
      });

      // Reset only the filled inputs but keep defaults for stock and quality
      setCommodityInputs(prev => 
        prev.map(input => ({
          ...input,
          price: "",
          stock: "available", // Reset to default "tersedia"
          quality: "good", // Reset to default "baik"
          notes: ""
        }))
      );

    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data survey",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMarketData = markets.find(m => m.id === parseInt(selectedMarket));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Survey Kepokmas</h1>
          <p className="text-muted-foreground">Input harga 50 item kepokmas untuk monitoring harga pasar</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Kepokmas Survey</span>
        </Badge>
      </div>

      {/* Market Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pilih Pasar Survey
          </CardTitle>
          <CardDescription>
            Pilih pasar untuk melakukan survey harga 50 item kepokmas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="market">Pasar *</Label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pasar untuk survey" />
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
              <Label htmlFor="date">Tanggal Survey</Label>
              <Input
                id="date"
                type="date"
                value={lastSurveyDate}
                onChange={(e) => setLastSurveyDate(e.target.value)}
              />
            </div>
          </div>
          
          {selectedMarketData && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">{selectedMarketData.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedMarketData.address}</p>
              <p className="text-sm text-muted-foreground">Kontak: {selectedMarketData.contact}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commodity Survey Form */}
      {selectedMarket && commodityInputs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Form Survey Komoditas</span>
              <Badge variant="secondary">
                {getCompletedCount()} / {commodityInputs.length} selesai
              </Badge>
            </CardTitle>
            <CardDescription>
              Isi harga untuk 50 item kepokmas di {selectedMarketData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Table for commodity inputs */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Komoditas</TableHead>
                      <TableHead className="w-1/6">Harga (Rp)</TableHead>
                      <TableHead className="w-1/6">Stok</TableHead>
                      <TableHead className="w-1/6">Kualitas</TableHead>
                      <TableHead className="w-1/4">Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commodityInputs.map((input) => (
                      <TableRow key={input.commodityId} className={isCommodityComplete(input) ? "bg-green-50" : ""}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{input.commodityName}</p>
                            <p className="text-sm text-muted-foreground">Per {input.unit}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            value={input.price}
                            onChange={(e) => updateCommodityInput(input.commodityId, 'price', e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={input.stock} 
                            onValueChange={(value) => updateCommodityInput(input.commodityId, 'stock', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Tersedia</SelectItem>
                              <SelectItem value="limited">Terbatas</SelectItem>
                              <SelectItem value="unavailable">Habis</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={input.quality} 
                            onValueChange={(value) => updateCommodityInput(input.commodityId, 'quality', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Sangat Baik</SelectItem>
                              <SelectItem value="good">Baik</SelectItem>
                              <SelectItem value="average">Sedang</SelectItem>
                              <SelectItem value="poor">Kurang</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Catatan..."
                            value={input.notes}
                            onChange={(e) => updateCommodityInput(input.commodityId, 'notes', e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button 
                  onClick={handleSubmitSurvey} 
                  disabled={isSubmitting || getCompletedCount() === 0}
                  className="flex items-center space-x-2"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Survey ({getCompletedCount()} item)</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {selectedMarket && commodityInputs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada komoditas yang tersedia untuk pasar ini</p>
          </CardContent>
        </Card>
      )}

      {!selectedMarket && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Pilih pasar untuk memulai survey harga komoditas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommoditySurveyForm;