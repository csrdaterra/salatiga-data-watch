import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCommodities } from "@/stores/commodityStore";
import { getLargeStores } from "@/stores/largeStoreStore";
import { Upload, Download, Plus, Trash2, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { downloadSampleStockBapoktingFile } from "@/utils/sampleFileGenerator";

interface StockBapoktingData {
  id?: string;
  survey_date: string;
  commodity_id: number;
  store_name: string;
  january_capaian: number;
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
  operator_name: string;
}

const StockBapoktingForm = () => {
  const [data, setData] = useState<StockBapoktingData[]>([]);
  const [operatorName, setOperatorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [largeStores, setLargeStores] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    loadCommodities();
    loadLargeStores();
  }, []);

  const loadCommodities = async () => {
    try {
      const commoditiesData = await getCommodities();
      setCommodities(commoditiesData);
    } catch (error) {
      console.error('Error loading commodities:', error);
    }
  };

  const loadLargeStores = () => {
    try {
      const storesData = getLargeStores();
      setLargeStores(storesData);
    } catch (error) {
      console.error('Error loading large stores:', error);
    }
  };

  const getCommodityName = (commodityId: number) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity?.name || 'Unknown';
  };

  const addNewRow = () => {
    const newRow: StockBapoktingData = {
      survey_date: new Date().toISOString().split('T')[0],
      commodity_id: 0,
      store_name: "",
      january_capaian: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      operator_name: operatorName
    };
    setData([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const updateRow = (index: number, field: keyof StockBapoktingData, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const processedData: StockBapoktingData[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length > 0) {
            const commodity = commodities.find(c => c.name === row[2]);
            processedData.push({
              survey_date: row[1] || new Date().toISOString().split('T')[0],
              commodity_id: commodity?.id || 0,
              store_name: row[3] || "",
              january_capaian: parseInt(row[4]) || 0,
              february: parseInt(row[5]) || 0,
              march: parseInt(row[6]) || 0,
              april: parseInt(row[7]) || 0,
              may: parseInt(row[8]) || 0,
              june: parseInt(row[9]) || 0,
              july: parseInt(row[10]) || 0,
              august: parseInt(row[11]) || 0,
              september: parseInt(row[12]) || 0,
              october: parseInt(row[13]) || 0,
              november: parseInt(row[14]) || 0,
              december: parseInt(row[15]) || 0,
              operator_name: operatorName
            });
          }
        }

        setData(processedData);
        toast({
          title: "Import Berhasil",
          description: `${processedData.length} baris data berhasil diimpor`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal mengimpor file. Pastikan format file sesuai.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data untuk diekspor",
        variant: "destructive"
      });
      return;
    }

    const exportData = data.map((row, index) => [
      index + 1, // No
      row.survey_date, // Tanggal Survey
      getCommodityName(row.commodity_id), // Komoditas
      row.store_name, // Nama Toko Besar
      row.january_capaian, // Januari (capaian)
      row.february, // Feb
      row.march, // Mar
      row.april, // Apr
      row.may, // Mei
      row.june, // Jun
      row.july, // Jul
      row.august, // Agt
      row.september, // Sep
      row.october, // Okt
      row.november, // Nov
      row.december // Des
    ]);

    // Add header
    const headers = [
      'No', 'Tanggal Survey', 'Komoditas', 'Nama Toko Besar',
      'Januari (capaian)', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const finalData = [headers, ...exportData];

    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Stok Bapokting');

    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Data_Stok_Bapokting_${currentDate}.xlsx`;
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export Berhasil",
      description: `Data berhasil diekspor ke ${filename}`
    });
  };

  const handleSave = async () => {
    if (!operatorName.trim()) {
      toast({
        title: "Error",
        description: "Nama operator harus diisi",
        variant: "destructive"
      });
      return;
    }

    if (data.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk disimpan",
        variant: "destructive"
      });
      return;
    }

    // Validate that all required fields are filled
    const incompleteRows = data.filter(row => 
      !row.survey_date || !row.commodity_id || !row.store_name
    );

    if (incompleteRows.length > 0) {
      toast({
        title: "Error",
        description: "Semua field tanggal, komoditas, dan nama toko harus diisi",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dataToSave = data.map(row => ({
        ...row,
        operator_name: operatorName,
        user_id: user?.id
      }));

      const { error } = await supabase
        .from('stock_bapokting')
        .insert(dataToSave);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data stok bapokting berhasil disimpan"
      });

      setData([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Input Data Stok Bapokting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Operator Name Input */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="operator">Nama Operator</Label>
            <Input
              id="operator"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="Masukkan nama operator"
            />
          </div>

          {/* Import/Export Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={downloadSampleStockBapoktingFile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Download Sample
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Excel
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
            <Button
              onClick={addNewRow}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            style={{ display: 'none' }}
          />

          {/* Data Table */}
          {data.length > 0 && (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Tanggal Survey</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Nama Toko Besar</TableHead>
                    <TableHead>Jan (capaian)</TableHead>
                    <TableHead>Feb</TableHead>
                    <TableHead>Mar</TableHead>
                    <TableHead>Apr</TableHead>
                    <TableHead>Mei</TableHead>
                    <TableHead>Jun</TableHead>
                    <TableHead>Jul</TableHead>
                    <TableHead>Agt</TableHead>
                    <TableHead>Sep</TableHead>
                    <TableHead>Okt</TableHead>
                    <TableHead>Nov</TableHead>
                    <TableHead>Des</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={row.survey_date}
                          onChange={(e) => updateRow(index, 'survey_date', e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={row.commodity_id.toString()}
                          onValueChange={(value) => updateRow(index, 'commodity_id', parseInt(value))}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Pilih komoditas" />
                          </SelectTrigger>
                          <SelectContent>
                            {commodities.map((commodity) => (
                              <SelectItem key={commodity.id} value={commodity.id.toString()}>
                                {commodity.name}
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
                          <SelectTrigger className="w-40">
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
                          value={row.january_capaian}
                          onChange={(e) => updateRow(index, 'january_capaian', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.february}
                          onChange={(e) => updateRow(index, 'february', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.march}
                          onChange={(e) => updateRow(index, 'march', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.april}
                          onChange={(e) => updateRow(index, 'april', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.may}
                          onChange={(e) => updateRow(index, 'may', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.june}
                          onChange={(e) => updateRow(index, 'june', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.july}
                          onChange={(e) => updateRow(index, 'july', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.august}
                          onChange={(e) => updateRow(index, 'august', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.september}
                          onChange={(e) => updateRow(index, 'september', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.october}
                          onChange={(e) => updateRow(index, 'october', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.november}
                          onChange={(e) => updateRow(index, 'november', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.december}
                          onChange={(e) => updateRow(index, 'december', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => removeRow(index)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Save Button */}
          {data.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockBapoktingForm;