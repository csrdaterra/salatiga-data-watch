import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus } from 'lucide-react';
import ImportExportControls from './ImportExportControls';

interface Commodity {
  id: number;
  name: string;
  category: string;
  unit: string;
  description?: string;
  is_essential: boolean;
}

const KepokmasTable = () => {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Get unique categories from commodities
  const categories = ['Semua', ...Array.from(new Set(commodities.map(c => c.category)))];

  const filteredCommodities = commodities.filter(commodity => {
    const matchesSearch = commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || commodity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadCommodities = async () => {
    try {
      const { data, error } = await supabase
        .from('commodities')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCommodities(data || []);
    } catch (error) {
      console.error('Error loading commodities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommodities();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Beras dan Serealia': 'bg-yellow-100 text-yellow-800',
      'Umbi-umbian': 'bg-orange-100 text-orange-800',
      'Ikan dan Daging': 'bg-red-100 text-red-800',
      'Sayuran': 'bg-green-100 text-green-800',
      'Buah-buahan': 'bg-pink-100 text-pink-800',
      'Kacang-kacangan': 'bg-amber-100 text-amber-800',
      'Susu dan Olahannya': 'bg-blue-100 text-blue-800',
      'Minyak dan Lemak': 'bg-indigo-100 text-indigo-800',
      'Bumbu-bumbuan': 'bg-purple-100 text-purple-800',
      'Rokok dan Tembakau': 'bg-gray-100 text-gray-800',
      'Perumahan dan Fasilitas': 'bg-stone-100 text-stone-800',
      'Sandang': 'bg-teal-100 text-teal-800',
      'Jasa': 'bg-cyan-100 text-cyan-800',
      'Emas': 'bg-yellow-200 text-yellow-900',
      'BBM': 'bg-slate-100 text-slate-800',
      'LPG': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Memuat data komoditas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Komoditas Kepokmas</h2>
          <p className="text-muted-foreground">
            Menampilkan {filteredCommodities.length} dari {commodities.length} komoditas esensial
          </p>
        </div>
        <div className="flex gap-2">
          <ImportExportControls onDataChange={loadCommodities} />
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Komoditas
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Komoditas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari komoditas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {category !== 'Semua' && (
                  <Badge variant="secondary" className="ml-2">
                    {commodities.filter(c => c.category === category).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commodities Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Komoditas</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommodities.map((commodity, index) => (
                <TableRow key={commodity.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{commodity.name}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(commodity.category)}>
                      {commodity.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{commodity.unit}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {commodity.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={commodity.is_essential ? "default" : "secondary"}>
                      {commodity.is_essential ? "Esensial" : "Non-Esensial"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCommodities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada komoditas yang ditemukan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KepokmasTable;