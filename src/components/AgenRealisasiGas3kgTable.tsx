import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

const agenRealisasiGas3kgSchema = z.object({
  nama_usaha: z.string().min(1, "Nama usaha harus diisi"),
  nomor_spbu: z.string().min(1, "Nomor SPBU harus diisi"),
  kecamatan: z.string().min(1, "Kecamatan harus diisi"),
  kelurahan: z.string().min(1, "Kelurahan harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  telepon: z.string().optional(),
  penanggungjawab: z.string().min(1, "Penanggung jawab harus diisi"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  target_bulanan: z.string().min(1, "Target bulanan harus diisi"),
  realisasi_bulanan: z.string().min(1, "Realisasi bulanan harus diisi"),
  periode_bulan: z.string().min(1, "Periode bulan harus diisi"),
  periode_tahun: z.string().min(1, "Periode tahun harus diisi"),
});

type AgenRealisasiGas3kgFormData = z.infer<typeof agenRealisasiGas3kgSchema>;

interface AgenRealisasiGas3kg {
  id: string;
  nama_usaha: string;
  nomor_spbu: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  telepon?: string;
  penanggungjawab: string;
  latitude?: number;
  longitude?: number;
  target_bulanan?: number;
  realisasi_bulanan?: number;
  periode_bulan: number;
  periode_tahun: number;
}

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function AgenRealisasiGas3kgTable() {
  const [data, setData] = useState<AgenRealisasiGas3kg[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgenRealisasiGas3kg | null>(null);
  const { toast } = useToast();

  const form = useForm<AgenRealisasiGas3kgFormData>({
    resolver: zodResolver(agenRealisasiGas3kgSchema),
    defaultValues: {
      nama_usaha: "",
      nomor_spbu: "",
      kecamatan: "",
      kelurahan: "",
      alamat: "",
      telepon: "",
      penanggungjawab: "",
      latitude: "",
      longitude: "",
      target_bulanan: "",
      realisasi_bulanan: "",
      periode_bulan: "",
      periode_tahun: "",
    },
  });

  const fetchData = async () => {
    try {
      const { data: realisasiData, error } = await supabase
        .from("agen_realisasi_gas_3kg")
        .select("*")
        .order("nama_usaha");

      if (error) throw error;
      setData(realisasiData || []);
    } catch (error) {
      console.error("Error fetching Agen Realisasi Gas 3kg data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data Realisasi Gas 3kg",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formData: AgenRealisasiGas3kgFormData) => {
    try {
      const submitData = {
        nama_usaha: formData.nama_usaha,
        nomor_spbu: formData.nomor_spbu,
        kecamatan: formData.kecamatan,
        kelurahan: formData.kelurahan,
        alamat: formData.alamat,
        telepon: formData.telepon || null,
        penanggungjawab: formData.penanggungjawab,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        target_bulanan: formData.target_bulanan ? parseInt(formData.target_bulanan) : null,
        realisasi_bulanan: formData.realisasi_bulanan ? parseInt(formData.realisasi_bulanan) : null,
        periode_bulan: parseInt(formData.periode_bulan),
        periode_tahun: parseInt(formData.periode_tahun),
      };

      if (editingItem) {
        const { error } = await supabase
          .from("agen_realisasi_gas_3kg")
          .update(submitData)
          .eq("id", editingItem.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data Realisasi Gas 3kg berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from("agen_realisasi_gas_3kg")
          .insert(submitData);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data Realisasi Gas 3kg berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data Realisasi Gas 3kg",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: AgenRealisasiGas3kg) => {
    setEditingItem(item);
    form.reset({
      nama_usaha: item.nama_usaha,
      nomor_spbu: item.nomor_spbu,
      kecamatan: item.kecamatan,
      kelurahan: item.kelurahan,
      alamat: item.alamat,
      telepon: item.telepon || "",
      penanggungjawab: item.penanggungjawab,
      latitude: item.latitude?.toString() || "",
      longitude: item.longitude?.toString() || "",
      target_bulanan: item.target_bulanan?.toString() || "",
      realisasi_bulanan: item.realisasi_bulanan?.toString() || "",
      periode_bulan: item.periode_bulan.toString(),
      periode_tahun: item.periode_tahun.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const { error } = await supabase
        .from("agen_realisasi_gas_3kg")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data Realisasi Gas 3kg berhasil dihapus",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data Realisasi Gas 3kg",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Realisasi Gas 3kg</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Realisasi Gas 3kg
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Realisasi Gas 3kg" : "Tambah Realisasi Gas 3kg"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nama_usaha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Usaha</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomor_spbu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor SPBU</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kecamatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kelurahan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelurahan</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="penanggungjawab"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penanggung Jawab</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="-7.3312" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="110.4917" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="target_bulanan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Bulanan (Tabung)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="realisasi_bulanan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Realisasi Bulanan (Tabung)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="periode_bulan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periode Bulan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih bulan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monthNames.map((month, index) => (
                              <SelectItem key={index} value={(index + 1).toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periode_tahun"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periode Tahun</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tahun" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingItem ? "Update" : "Simpan"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Usaha</TableHead>
              <TableHead>Nomor SPBU</TableHead>
              <TableHead>Kecamatan</TableHead>
              <TableHead>Kelurahan</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Target (Tabung)</TableHead>
              <TableHead>Realisasi (Tabung)</TableHead>
              <TableHead>Persentase</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nama_usaha}</TableCell>
                <TableCell>{item.nomor_spbu}</TableCell>
                <TableCell>{item.kecamatan}</TableCell>
                <TableCell>{item.kelurahan}</TableCell>
                <TableCell>
                  {monthNames[item.periode_bulan - 1]} {item.periode_tahun}
                </TableCell>
                <TableCell>{item.target_bulanan?.toLocaleString() || "-"}</TableCell>
                <TableCell>{item.realisasi_bulanan?.toLocaleString() || "-"}</TableCell>
                <TableCell>
                  {item.target_bulanan && item.realisasi_bulanan 
                    ? `${((item.realisasi_bulanan / item.target_bulanan) * 100).toFixed(1)}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}