import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Upload, Database, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import {
  downloadSampleSurveyFile,
  downloadSampleStockBapoktingFile,
  downloadSampleMarketFile,
  downloadSampleCommodityFile,
  downloadSampleGasStationFile,
  downloadSampleLargeStoreFile
} from '@/utils/sampleFileGenerator';

interface ImportExportControlsProps {
  onDataChange?: () => void;
}

const ImportExportControls: React.FC<ImportExportControlsProps> = ({ onDataChange }) => {
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const tableOptions = [
    { value: 'commodities', label: 'Komoditas', sampleFunction: downloadSampleCommodityFile },
    { value: 'markets', label: 'Data Pasar', sampleFunction: downloadSampleMarketFile },
    { value: 'price_surveys', label: 'Survey Harga', sampleFunction: downloadSampleSurveyFile },
    { value: 'stock_bapokting', label: 'Stock Bapokting', sampleFunction: downloadSampleStockBapoktingFile },
    { value: 'agen_lpg', label: 'Agen LPG', sampleFunction: downloadSampleGasStationFile },
    { value: 'pangkalan_lpg', label: 'Pangkalan LPG', sampleFunction: downloadSampleGasStationFile },
    { value: 'spbu_lpg', label: 'SPBU LPG', sampleFunction: downloadSampleGasStationFile },
    { value: 'spbe', label: 'SPBE', sampleFunction: downloadSampleGasStationFile },
    { value: 'agen_realisasi_bbm', label: 'Realisasi BBM', sampleFunction: downloadSampleGasStationFile },
    { value: 'agen_realisasi_gas_3kg', label: 'Realisasi Gas 3kg', sampleFunction: downloadSampleGasStationFile },
    { value: 'jenis_bbm', label: 'Jenis BBM', sampleFunction: downloadSampleGasStationFile }
  ];

  const handleExport = async () => {
    if (!selectedTable) {
      toast({
        title: "Error",
        description: "Pilih tabel yang akan diekspor",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(selectedTable as any)
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, selectedTable);
        
        const selectedOption = tableOptions.find(opt => opt.value === selectedTable);
        const fileName = `Export_${selectedOption?.label || selectedTable}_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        
        toast({
          title: "Berhasil",
          description: `Data ${selectedOption?.label} berhasil diekspor`,
        });
      } else {
        toast({
          title: "Info",
          description: "Tidak ada data untuk diekspor",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Gagal mengekspor data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsExportDialogOpen(false);
    }
  };

  const handleImport = async () => {
    if (!selectedTable || !importFile) {
      toast({
        title: "Error",
        description: "Pilih tabel dan file yang akan diimport",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = await importFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast({
          title: "Error",
          description: "File tidak berisi data",
          variant: "destructive"
        });
        return;
      }

      // Insert data to Supabase
      const { error } = await supabase
        .from(selectedTable as any)
        .insert(jsonData as any);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `${jsonData.length} record berhasil diimport`,
      });

      onDataChange?.();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Gagal mengimport data. Pastikan format file sesuai template.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsImportDialogOpen(false);
      setImportFile(null);
    }
  };

  const handleDownloadSample = () => {
    const selectedOption = tableOptions.find(opt => opt.value === selectedTable);
    if (selectedOption && selectedOption.sampleFunction) {
      selectedOption.sampleFunction();
      toast({
        title: "Download Berhasil",
        description: `Template ${selectedOption.label} berhasil didownload`,
      });
    }
  };

  return (
    <div className="flex gap-2">
      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              Pilih tabel yang akan diekspor ke file Excel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="export-table">Pilih Tabel</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tabel yang akan diekspor" />
                </SelectTrigger>
                <SelectContent>
                  {tableOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleExport} disabled={loading || !selectedTable}>
                {loading ? 'Mengekspor...' : 'Export'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Upload file Excel untuk import data ke database
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-table">Pilih Tabel</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tabel tujuan import" />
                </SelectTrigger>
                <SelectContent>
                  {tableOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTable && (
              <div>
                <Button 
                  variant="ghost" 
                  onClick={handleDownloadSample}
                  className="flex items-center gap-2 w-full"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Download Template {tableOptions.find(opt => opt.value === selectedTable)?.label}
                </Button>
              </div>
            )}

            <div>
              <Label htmlFor="import-file">Pilih File Excel</Label>
              <Input
                id="import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleImport} disabled={loading || !selectedTable || !importFile}>
                {loading ? 'Mengimport...' : 'Import'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportControls;