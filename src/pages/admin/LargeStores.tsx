import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Building2, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { downloadSampleLargeStoreFile } from "@/utils/sampleFileGenerator";
import { 
  getLargeStores, 
  setLargeStores, 
  addLargeStore, 
  updateLargeStore, 
  deleteLargeStore, 
  type LargeStore 
} from "@/stores/largeStoreStore";

const storeSchema = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  ownerName: z.string().min(1, "Nama pemilik wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contact: z.string().min(1, "Kontak wajib diisi"),
  commodities: z.string().min(1, "Nama komoditas wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
});

type StoreFormData = z.infer<typeof storeSchema>;

const LargeStores = () => {
  const { toast } = useToast();
  const [stores, setStores] = useState<LargeStore[]>(() => getLargeStores());
  const [editingStore, setEditingStore] = useState<LargeStore | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      address: "",
      contact: "",
      commodities: "",
      longitude: "",
      latitude: "",
    },
  });

  const onSubmit = (data: StoreFormData) => {
    if (editingStore) {
      updateLargeStore(editingStore.id, data);
      setStores(getLargeStores());
      toast({
        title: "Berhasil",
        description: "Data toko besar berhasil diperbarui",
      });
    } else {
      const newStore: LargeStore = {
        id: Date.now(),
        storeName: data.storeName,
        ownerName: data.ownerName,
        address: data.address,
        contact: data.contact,
        commodities: data.commodities,
        longitude: data.longitude,
        latitude: data.latitude,
      };
      addLargeStore(newStore);
      setStores(getLargeStores());
      toast({
        title: "Berhasil",
        description: "Data toko besar berhasil ditambahkan",
      });
    }
    
    form.reset();
    setEditingStore(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (store: LargeStore) => {
    setEditingStore(store);
    form.reset(store);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteLargeStore(id);
    setStores(getLargeStores());
    toast({
      title: "Berhasil",
      description: "Data toko besar berhasil dihapus",
    });
  };

  const handleAddNew = () => {
    setEditingStore(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Toko Besar</h1>
          <p className="text-muted-foreground">Kelola informasi toko besar dan supermarket</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadSampleLargeStoreFile} 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Sample</span>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Tambah Toko</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingStore ? "Edit Toko Besar" : "Tambah Toko Besar Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingStore ? "Perbarui informasi toko besar" : "Tambahkan data toko besar baru"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Toko</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama toko" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pemilik</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama pemilik" {...field} />
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
                          <Input placeholder="Masukkan alamat toko" {...field} />
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
                    name="commodities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Komoditas</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Beras, Gula, Minyak Goreng" {...field} />
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
                      {editingStore ? "Perbarui" : "Tambah"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Daftar Toko Besar
          </CardTitle>
          <CardDescription>
            Total {stores.length} toko besar terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Toko</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.storeName}</TableCell>
                  <TableCell>{store.ownerName}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>{store.contact}</TableCell>
                  <TableCell>{store.commodities}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {store.latitude}, {store.longitude}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(store)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(store.id)}
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

export default LargeStores;