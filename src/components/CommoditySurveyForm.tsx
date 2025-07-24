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
import { Save, MapPin, DollarSign, RefreshCw } from "lucide-react";
import { getCommodities, getMarketCommoditiesByMarket } from "@/stores/commodityStore";
import { getMarkets } from "@/stores/marketStore";
import { supabase } from "@/integrations/supabase/client";

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

  const allCommodities = getCommodities();
  const markets = getMarkets();

  // Get available commodities for selected market
  const getAvailableCommoditiesForMarket = (marketId: number) => {
    const marketCommodities = getMarketCommoditiesByMarket(marketId);
    return allCommodities.filter(commodity => 
      marketCommodities.some(mc => mc.commodityId === commodity.id && mc.availability)
    );
  };

  // Initialize commodity inputs when market is selected
  useEffect(() => {
    if (selectedMarket) {
      const marketId = parseInt(selectedMarket);
      const availableCommodities = getAvailableCommoditiesForMarket(marketId);
      
      const initialInputs: CommodityPriceInput[] = availableCommodities.map(commodity => ({
        commodityId: commodity.id,
        commodityName: commodity.name,
        unit: commodity.unit,
        price: "",
        stock: "",
        quality: "",
        notes: ""
      }));
      
      setCommodityInputs(initialInputs);
      setLastSurveyDate(new Date().toISOString().split('T')[0]);
    } else {
      setCommodityInputs([]);
    }
  }, [selectedMarket]);

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare data for storage
      const surveyData = completedInputs.map(input => ({
        market_id: parseInt(selectedMarket),
        commodity_id: input.commodityId,
        price: parseInt(input.price),
        stock_status: input.stock as 'available' | 'limited' | 'unavailable',
        quality: input.quality as 'excellent' | 'good' | 'average' | 'poor',
        notes: input.notes || null,
        survey_date: lastSurveyDate,
        operator_name: "Operator Aktif",
        user_id: user?.id
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

      // Reset only the filled inputs
      setCommodityInputs(prev => 
        prev.map(input => ({
          ...input,
          price: "",
          stock: "",
          quality: "",
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
          <h1 className="text-3xl font-bold text-foreground">Survey Harga Komoditas</h1>
          <p className="text-muted-foreground">Input harga semua komoditas berdasarkan pasar yang dipilih</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Mode Operator</span>
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
            Pilih pasar untuk melakukan survey harga komoditas
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
              Isi harga untuk semua komoditas yang tersedia di {selectedMarketData?.name}
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