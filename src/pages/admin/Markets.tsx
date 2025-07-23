import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Store } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const marketSchema = z.object({
  name: z.string().min(1, "Nama pasar wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contact: z.string().min(1, "Kontak wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
});

type MarketFormData = z.infer<typeof marketSchema>;

interface Market {
  id: number;
  name: string;
  address: string;
  contact: string;
  longitude: string;
  latitude: string;
}

const Markets = () => {
  const { toast } = useToast();
  const [markets, setMarkets] = useState<Market[]>([
    {
      id: 1,
      name: "Pasar Argosari",
      address: "Jl. Diponegoro No. 123, Salatiga",
      contact: "0298-321123",
      longitude: "110.4872",
      latitude: "-7.3313"
    },
    {
      id: 2,
      name: "Pasar Raya Salatiga",
      address: "Jl. Ahmad Yani No. 45, Salatiga",
      contact: "0298-321456",
      longitude: "110.4928",
      latitude: "-7.3298"
    }
  ]);
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<MarketFormData>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      address: "",
      contact: "",
      longitude: "",
      latitude: "",
    },
  });

  const onSubmit = (data: MarketFormData) => {
    if (editingMarket) {
      setMarkets(markets.map(market => 
        market.id === editingMarket.id 
          ? { ...market, ...data }
          : market
      ));
      toast({
        title: "Berhasil",
        description: "Data pasar berhasil diperbarui",
      });
    } else {
      const newMarket: Market = {
        id: Date.now(),
        name: data.name,
        address: data.address,
        contact: data.contact,
        longitude: data.longitude,
        latitude: data.latitude,
      };
      setMarkets([...markets, newMarket]);
      toast({
        title: "Berhasil",
        description: "Data pasar berhasil ditambahkan",
      });
    }
    
    form.reset();
    setEditingMarket(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (market: Market) => {
    setEditingMarket(market);
    form.reset(market);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setMarkets(markets.filter(market => market.id !== id));
    toast({
      title: "Berhasil",
      description: "Data pasar berhasil dihapus",
    });
  };

  const handleAddNew = () => {
    setEditingMarket(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Pasar</h1>
          <p className="text-muted-foreground">Kelola informasi pasar tradisional</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Pasar</span>
            </Button>
          </DialogTrigger>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="110.4872" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="-7.3313" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
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
                <TableHead>Koordinat</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {markets.map((market) => (
                <TableRow key={market.id}>
                  <TableCell className="font-medium">{market.name}</TableCell>
                  <TableCell>{market.address}</TableCell>
                  <TableCell>{market.contact}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {market.latitude}, {market.longitude}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(market)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(market.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Markets;