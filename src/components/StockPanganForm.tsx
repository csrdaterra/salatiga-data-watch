import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getLargeStores } from "@/stores/largeStoreStore";
import { Plus, Trash2, Save } from "lucide-react";

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
  const [data, setData] = useState<StockPanganData[]>([]);
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

  const addNewRow = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk menambah data",
        variant: "destructive"
      });
      return;
    }

    const newRow: StockPanganData = {
      survey_date: new Date().toISOString().split('T')[0],
      commodity_name: "",
      store_name: "",
      price: 0,
      stock_quantity: 0,
      operator_name: user.email || "Operator",
      notes: ""
    };
    setData([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const updateRow = (index: number, field: keyof StockPanganData, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const handleSave = async () => {
    if (data.length === 0) {
      toast({
        title: "Error", 
        description: "Tidak ada data untuk disimpan",
        variant: "destructive"
      });
      return;
    }

    // Validate data
    const invalidRows = data.filter(row => 
      !row.commodity_name || !row.store_name || row.price <= 0
    );

    if (invalidRows.length > 0) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi dan harga harus lebih dari 0",
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
      const stockPanganData = data.map(row => ({
        survey_date: row.survey_date,
        commodity_name: row.commodity_name,
        store_name: row.store_name,
        price: row.price,
        stock_quantity: row.stock_quantity,
        operator_name: row.operator_name,
        notes: row.notes,
        user_id: user.id,
        created_at: new Date().toISOString()
      }));

      // For now, we'll store in browser localStorage as demo
      // In production, you should create a proper database table
      const existingData = JSON.parse(localStorage.getItem('stock_pangan_data') || '[]');
      const newStoredData = [...existingData, ...stockPanganData];
      localStorage.setItem('stock_pangan_data', JSON.stringify(newStoredData));

      toast({
        title: "Success",
        description: `Berhasil menyimpan ${data.length} data stok pangan`,
      });

      // Reset form
      setData([]);

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
          <Plus className="w-5 h-5" />
          <span>Input Stok Pangan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {user ? `Operator: ${user.email}` : "Silakan login terlebih dahulu"}
          </div>
          <Button onClick={addNewRow} disabled={!user}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data Stok
          </Button>
        </div>

        {data.length > 0 && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Toko Besar</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          type="date"
                          value={row.survey_date}
                          onChange={(e) => updateRow(index, 'survey_date', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={row.commodity_name}
                          onValueChange={(value) => updateRow(index, 'commodity_name', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih komoditas" />
                          </SelectTrigger>
                          <SelectContent>
                            {stockPanganCommodities.map((commodity) => (
                              <SelectItem key={commodity.id} value={commodity.name}>
                                {commodity.name} ({commodity.unit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={row.store_name}
                          onValueChange={(value) => updateRow(index, 'store_name', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih toko" />
                          </SelectTrigger>
                          <SelectContent>
                            {largeStores.map((store) => (
                              <SelectItem key={store.id} value={store.storeName}>
                                {store.storeName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.price}
                          onChange={(e) => updateRow(index, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Harga"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.stock_quantity}
                          onChange={(e) => updateRow(index, 'stock_quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Jumlah stok"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.notes || ""}
                          onChange={(e) => updateRow(index, 'notes', e.target.value)}
                          placeholder="Catatan (opsional)"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => removeRow(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Total: {data.length} data stok pangan
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isLoading || data.length === 0}
                className="ml-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Klik "Tambah Data Stok" untuk mulai menginput data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockPanganForm;