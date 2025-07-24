import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  getGasStations, 
  addGasStation, 
  updateGasStation, 
  deleteGasStation, 
  FUEL_TYPES,
  type GasStation 
} from "@/stores/gasStationStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Fuel, FileDown } from "lucide-react";
import { downloadSampleGasStationFile } from "@/utils/sampleFileGenerator";

const gasStationSchema = z.object({
  name: z.string().min(1, "Nama SPBU harus diisi"),
  address: z.string().min(1, "Alamat harus diisi"),
  fuelTypes: z.array(z.string()).min(1, "Pilih minimal satu jenis BBM"),
  longitude: z.string().min(1, "Longitude harus diisi"),
  latitude: z.string().min(1, "Latitude harus diisi"),
  kecamatan: z.string().optional(),
});

type GasStationFormData = z.infer<typeof gasStationSchema>;

const GasStations = () => {
  const [gasStations, setGasStationsState] = useState<GasStation[]>([]);
  const [editingGasStation, setEditingGasStation] = useState<GasStation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setGasStationsState(getGasStations());
  }, []);

  const form = useForm<GasStationFormData>({
    resolver: zodResolver(gasStationSchema),
    defaultValues: {
      name: "",
      address: "",
      fuelTypes: [],
      longitude: "",
      latitude: "",
      kecamatan: "",
    },
  });

  const onSubmit = (data: GasStationFormData) => {
    if (editingGasStation) {
      updateGasStation(editingGasStation.id, data);
      setGasStationsState(getGasStations());
      toast({
        title: "Berhasil",
        description: "Data SPBU berhasil diperbarui",
      });
    } else {
      const newStation: GasStation = {
        id: Date.now(),
        name: data.name,
        address: data.address,
        fuelTypes: data.fuelTypes,
        longitude: data.longitude,
        latitude: data.latitude,
        kecamatan: data.kecamatan,
      };
      addGasStation(newStation);
      setGasStationsState(getGasStations());
      toast({
        title: "Berhasil",
        description: "SPBU baru berhasil ditambahkan",
      });
    }
    
    form.reset();
    setEditingGasStation(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (station: GasStation) => {
    setEditingGasStation(station);
    form.reset({
      name: station.name,
      address: station.address,
      fuelTypes: station.fuelTypes,
      longitude: station.longitude,
      latitude: station.latitude,
      kecamatan: station.kecamatan || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteGasStation(id);
    setGasStationsState(getGasStations());
    toast({
      title: "Berhasil",
      description: "SPBU berhasil dihapus",
    });
  };

  const handleAddNew = () => {
    setEditingGasStation(null);
    form.reset({
      name: "",
      address: "",
      fuelTypes: [],
      longitude: "",
      latitude: "",
      kecamatan: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SPBU Salatiga</h1>
          <p className="text-muted-foreground">Kelola informasi SPBU dan jenis BBM yang dijual</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadSampleGasStationFile} 
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
                <span>Tambah SPBU</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingGasStation ? "Edit SPBU" : "Tambah SPBU Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingGasStation ? "Perbarui informasi SPBU" : "Tambahkan data SPBU baru"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama SPBU</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: SPBU 44.507.16" {...field} />
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
                          <Input placeholder="Masukkan alamat lengkap" {...field} />
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
                            <Input placeholder="110.4928" {...field} />
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
                            <Input placeholder="-7.3298" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="fuelTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Jenis BBM yang Dijual</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {FUEL_TYPES.map((fuelType) => (
                            <FormField
                              key={fuelType}
                              control={form.control}
                              name="fuelTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={fuelType}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(fuelType)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, fuelType])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== fuelType
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {fuelType}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kecamatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kecamatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sidorejo">Sidorejo</SelectItem>
                            <SelectItem value="Sidomukti">Sidomukti</SelectItem>
                            <SelectItem value="Tingkir">Tingkir</SelectItem>
                            <SelectItem value="Argomulyo">Argomulyo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fuel className="w-5 h-5 mr-2" />
            Daftar SPBU Salatiga
          </CardTitle>
          <CardDescription>
            Total {gasStations.length} SPBU terdaftar di Kota Salatiga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama SPBU</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Jenis BBM</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead>Kecamatan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gasStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {station.fuelTypes.map((fuel) => (
                        <Badge key={fuel} variant="secondary" className="text-xs">
                          {fuel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {station.latitude}, {station.longitude}
                    </span>
                  </TableCell>
                  <TableCell>
                    {station.kecamatan ? (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {station.kecamatan}
                      </span>
                    ) : (
                      "-"
                    )}
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