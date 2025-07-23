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
import { Plus, Edit, Trash2, Fuel } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const gasStationSchema = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  ownerName: z.string().min(1, "Nama pemilik wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contact: z.string().min(1, "Kontak wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
});

type GasStationFormData = z.infer<typeof gasStationSchema>;

interface GasStation {
  id: number;
  storeName: string;
  ownerName: string;
  address: string;
  contact: string;
  longitude: string;
  latitude: string;
}

const GasStations = () => {
  const { toast } = useToast();
  const [gasStations, setGasStations] = useState<GasStation[]>([
    {
      id: 1,
      storeName: "SPBU Diponegoro",
      ownerName: "PT. Pertamina (Persero)",
      address: "Jl. Diponegoro No. 89, Salatiga",
      contact: "0298-321111",
      longitude: "110.4856",
      latitude: "-7.3325"
    },
    {
      id: 2,
      storeName: "Pertashop Kartini",
      ownerName: "Ahmad Wijaya",
      address: "Jl. Kartini No. 67, Salatiga",
      contact: "0298-322222",
      longitude: "110.4934",
      latitude: "-7.3278"
    },
    {
      id: 3,
      storeName: "SPBU Ahmad Yani",
      ownerName: "PT. Pertamina (Persero)",
      address: "Jl. Ahmad Yani No. 112, Salatiga",
      contact: "0298-323333",
      longitude: "110.4912",
      latitude: "-7.3245"
    }
  ]);
  const [editingGasStation, setEditingGasStation] = useState<GasStation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<GasStationFormData>({
    resolver: zodResolver(gasStationSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      address: "",
      contact: "",
      longitude: "",
      latitude: "",
    },
  });

  const onSubmit = (data: GasStationFormData) => {
    if (editingGasStation) {
      setGasStations(gasStations.map(station => 
        station.id === editingGasStation.id 
          ? { ...station, ...data }
          : station
      ));
      toast({
        title: "Berhasil",
        description: "Data SPBU/Pertashop berhasil diperbarui",
      });
    } else {
      const newGasStation: GasStation = {
        id: Date.now(),
        storeName: data.storeName,
        ownerName: data.ownerName,
        address: data.address,
        contact: data.contact,
        longitude: data.longitude,
        latitude: data.latitude,
      };
      setGasStations([...gasStations, newGasStation]);
      toast({
        title: "Berhasil",
        description: "Data SPBU/Pertashop berhasil ditambahkan",
      });
    }
    
    form.reset();
    setEditingGasStation(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (gasStation: GasStation) => {
    setEditingGasStation(gasStation);
    form.reset(gasStation);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setGasStations(gasStations.filter(station => station.id !== id));
    toast({
      title: "Berhasil",
      description: "Data SPBU/Pertashop berhasil dihapus",
    });
  };

  const handleAddNew = () => {
    setEditingGasStation(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SPBU & Pertashop</h1>
          <p className="text-muted-foreground">Kelola informasi SPBU dan Pertashop</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah SPBU/Pertashop</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGasStation ? "Edit SPBU/Pertashop" : "Tambah SPBU/Pertashop Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingGasStation ? "Perbarui informasi SPBU/Pertashop" : "Tambahkan data SPBU/Pertashop baru"}
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
                        <Input placeholder="Masukkan nama SPBU/Pertashop" {...field} />
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
                        <Input placeholder="Masukkan alamat" {...field} />
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
                    {editingGasStation ? "Perbarui" : "Tambah"}
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
            <Fuel className="w-5 h-5 mr-2" />
            Daftar SPBU & Pertashop
          </CardTitle>
          <CardDescription>
            Total {gasStations.length} lokasi BBM terdaftar
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
                <TableHead>Koordinat</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gasStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.storeName}</TableCell>
                  <TableCell>{station.ownerName}</TableCell>
                  <TableCell>{station.address}</TableCell>
                  <TableCell>{station.contact}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {station.latitude}, {station.longitude}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(station)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(station.id)}
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

export default GasStations;