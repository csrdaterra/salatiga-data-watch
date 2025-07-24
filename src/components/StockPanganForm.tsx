import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getLargeStores } from "@/stores/largeStoreStore";
import { Plus, Trash2, Save, Store, Package2 } from "lucide-react";

// 9 komoditas stok pangan yang disebutkan user
const stockPanganCommodities = [
  { id: 'garam-halus', name: 'Garam Halus', unit: 'kg' },
  { id: 'garam-bata', name: 'Garam Bata', unit: 'kg' },
  { id: 'telur', name: 'Telur', unit: 'kg' },
  { id: 'minyak-kemasan', name: 'Minyak Goreng Kemasan', unit: 'liter' },
  { id: 'minyak-curah', name: 'Minyak Goreng Curah', unit: 'liter' },
  { id: 'gula-pasir', name: 'Gula Pasir', unit: 'kg' },
  { id: 'tepung-terigu', name: 'Tepung Terigu', unit: 'kg' },
  { id: 'kedelai', name: 'Kedelai', unit: 'kg' },
  { id: 'beras', name: 'Beras', unit: 'kg' },
];

interface StockPanganData {
  id?: string;
  survey_date: string;
  commodity_name: string;
  store_name: string;
  price: number;
  stock_quantity: number;
  operator_name: string;
  notes?: string;
}

const StockPanganForm = () => {
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [commodityInputs, setCommodityInputs] = useState<Record<string, { price: number; stock_quantity: number; notes: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [largeStores, setLargeStores] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLargeStores();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadLargeStores = () => {
    try {
      const storesData = getLargeStores();
      setLargeStores(storesData);
    } catch (error) {
      console.error('Error loading large stores:', error);
    }
  };

  const updateCommodityInput = (commodityId: string, field: string, value: any) => {
    setCommodityInputs(prev => ({
      ...prev,
      [commodityId]: {
        ...prev[commodityId],
        [field]: value
      }
    }));
  };

  const isCommodityComplete = (commodityId: string) => {
    const input = commodityInputs[commodityId];
    return input && input.price > 0 && input.stock_quantity >= 0;
  };

  const getCompletedCount = () => {
    return stockPanganCommodities.filter(commodity => 
      isCommodityComplete(commodity.id)
    ).length;
  };

  const handleSave = async () => {
    if (!selectedStore) {
      toast({
        title: "Error",
        description: "Pilih toko terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const completedInputs = stockPanganCommodities.filter(commodity => 
      isCommodityComplete(commodity.id)
    );

    if (completedInputs.length === 0) {
      toast({
        title: "Error", 
        description: "Minimal satu komoditas harus diisi",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Error",
          description: "Anda harus login untuk menyimpan data",
          variant: "destructive"
        });
        return;
      }

      // Since we don't have a specific table for stock pangan, we'll create the data
      // You might want to create a specific table for this or modify existing table
      const stockPanganData = completedInputs.map(commodity => {
        const input = commodityInputs[commodity.id];
        return {
          survey_date: surveyDate,
          commodity_name: commodity.name,
          store_name: selectedStore,
          price: input.price,
          stock_quantity: input.stock_quantity,
          operator_name: user.email || "Operator",
          notes: input.notes || "",
          user_id: user.id,
          created_at: new Date().toISOString()
        };
      });

      // For now, we'll store in browser localStorage as demo
      // In production, you should create a proper database table
      const existingData = JSON.parse(localStorage.getItem('stock_pangan_data') || '[]');
      const newStoredData = [...existingData, ...stockPanganData];
      localStorage.setItem('stock_pangan_data', JSON.stringify(newStoredData));

      toast({
        title: "Success",
        description: `Berhasil menyimpan ${completedInputs.length} data stok pangan untuk ${selectedStore}`,
      });

      // Reset form
      setCommodityInputs({});
      setSelectedStore("");
      setSurveyDate(new Date().toISOString().split('T')[0]);

    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package2 className="w-5 h-5" />
          <span>Input Stok Pangan per Toko Besar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Selection and Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="survey-date">Tanggal Survey</Label>
            <Input
              id="survey-date"
              type="date"
              value={surveyDate}
              onChange={(e) => setSurveyDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="store-select">Pilih Toko Besar</Label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger id="store-select" className="mt-1">
                <SelectValue placeholder="Pilih toko besar" />
              </SelectTrigger>
              <SelectContent>
                {largeStores.map((store) => (
                  <SelectItem key={store.id} value={store.storeName}>
                    <div className="flex items-center space-x-2">
                      <Store className="w-4 h-4" />
                      <span>{store.storeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-muted-foreground w-full">
              {user ? `Operator: ${user.email}` : "Silakan login terlebih dahulu"}
            </div>
          </div>
        </div>

        {selectedStore && (
          <>
            {/* Progress Information */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress Input Komoditas</span>
                <Badge variant={getCompletedCount() === stockPanganCommodities.length ? "default" : "secondary"}>
                  {getCompletedCount()}/{stockPanganCommodities.length} selesai
                </Badge>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(getCompletedCount() / stockPanganCommodities.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Commodity Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input Stok Komoditas - {selectedStore}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Komoditas</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Harga (Rp)</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Catatan</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockPanganCommodities.map((commodity) => {
                        const input = commodityInputs[commodity.id] || { price: 0, stock_quantity: 0, notes: "" };
                        const isComplete = isCommodityComplete(commodity.id);
                        
                        return (
                          <TableRow key={commodity.id} className={isComplete ? "bg-green-50" : ""}>
                            <TableCell className="font-medium">{commodity.name}</TableCell>
                            <TableCell>{commodity.unit}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={input.price || ""}
                                onChange={(e) => updateCommodityInput(commodity.id, 'price', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={input.stock_quantity || ""}
                                onChange={(e) => updateCommodityInput(commodity.id, 'stock_quantity', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={input.notes || ""}
                                onChange={(e) => updateCommodityInput(commodity.id, 'notes', e.target.value)}
                                placeholder="Catatan opsional"
                                className="w-32"
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant={isComplete ? "default" : "secondary"}>
                                {isComplete ? "Selesai" : "Belum"}
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

            {/* Save Button */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {getCompletedCount() > 0 && `${getCompletedCount()} komoditas siap disimpan`}
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isLoading || getCompletedCount() === 0 || !user}
                className="ml-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Menyimpan..." : `Simpan Data (${getCompletedCount()} items)`}
              </Button>
            </div>
          </>
        )}

        {!selectedStore && (
          <div className="text-center py-8 text-muted-foreground">
            <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Pilih toko besar terlebih dahulu untuk mulai input stok pangan</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockPanganForm;