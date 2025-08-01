import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Store, Search, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImportExportControls from './ImportExportControls';

const marketSchema = z.object({
  name: z.string().min(1, "Nama pasar wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contact: z.string().optional(),
  city: z.string().default("Salatiga"),
});

type MarketFormData = z.infer<typeof marketSchema>;

interface Market {
  id: number;
  name: string;
  address: string;
  contact?: string;
  city: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const KepokmasMarketTable = () => {
  const { toast } = useToast();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<MarketFormData>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      address: "",
      contact: "",
      city: "Salatiga",
    },
  });

  const loadMarkets = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pasar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  useEffect(() => {
    const filtered = markets.filter(market =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMarkets(filtered);
  }, [markets, searchTerm]);

  const onSubmit = async (data: MarketFormData) => {
    try {
      if (editingMarket) {
        const { error } = await supabase
          .from('markets')
          .update({
            name: data.name,
            address: data.address,
            contact: data.contact,
            city: data.city,
          })
          .eq('id', editingMarket.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data pasar berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('markets')
          .insert({
            name: data.name,
            address: data.address,
            contact: data.contact,
            city: data.city,
          });

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data pasar berhasil ditambahkan",
        });
      }

      form.reset();
      setEditingMarket(null);
      setIsDialogOpen(false);
      loadMarkets();
    } catch (error) {
      console.error('Error saving market:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data pasar",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (market: Market) => {
    setEditingMarket(market);
    form.reset(market);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('markets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data pasar berhasil dihapus",
      });

      loadMarkets();
    } catch (error) {
      console.error('Error deleting market:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus data pasar",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setEditingMarket(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6" />
            Data Pasar
          </h2>
          <p className="text-muted-foreground">
            Kelola data pasar tradisional untuk survey komoditas
          </p>
        </div>
        <div className="flex gap-2">
          <ImportExportControls onDataChange={loadMarkets} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Pasar
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari pasar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredMarkets.length} pasar
        </Badge>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Daftar Pasar
          </CardTitle>
          <CardDescription>
            Total {markets.length} pasar terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pasar</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarkets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'Tidak ada pasar yang sesuai pencarian' : 'Belum ada data pasar'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMarkets.map((market) => (
                  <TableRow key={market.id}>
                    <TableCell className="font-medium">{market.name}</TableCell>
                    <TableCell>{market.address}</TableCell>
                    <TableCell>{market.contact || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={market.is_active ? 'default' : 'secondary'}>
                        {market.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(market)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(market.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingMarket ? "Edit Pasar" : "Tambah Pasar Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingMarket ? "Perbarui informasi pasar" : "Tambahkan data pasar baru"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pasar</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama pasar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan alamat pasar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontak</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor telepon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kota" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Salatiga">Salatiga</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingMarket ? "Perbarui" : "Tambah"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KepokmasMarketTable;