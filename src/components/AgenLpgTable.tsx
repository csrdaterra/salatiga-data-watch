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
import { Plus, Pencil, Trash2 } from "lucide-react";

const agenLpgSchema = z.object({
  nama_usaha: z.string().min(1, "Nama usaha harus diisi"),
  nomor_spbu: z.string().min(1, "Nomor SPBU harus diisi"),
  kecamatan: z.string().min(1, "Kecamatan harus diisi"),
  kelurahan: z.string().min(1, "Kelurahan harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  telepon: z.string().optional(),
  penanggungjawab: z.string().min(1, "Penanggung jawab harus diisi"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type AgenLpgFormData = z.infer<typeof agenLpgSchema>;

interface AgenLpg {
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
}

export function AgenLpgTable() {
  const [data, setData] = useState<AgenLpg[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgenLpg | null>(null);
  const { toast } = useToast();

  const form = useForm<AgenLpgFormData>({
    resolver: zodResolver(agenLpgSchema),
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
    },
  });

  const fetchData = async () => {
    try {
      const { data: agenData, error } = await supabase
        .from("agen_lpg")
        .select("*")
        .order("nama_usaha");

      if (error) throw error;
      setData(agenData || []);
    } catch (error) {
      console.error("Error fetching Agen LPG data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data Agen LPG",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formData: AgenLpgFormData) => {
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
      };

      if (editingItem) {
        const { error } = await supabase
          .from("agen_lpg")
          .update(submitData)
          .eq("id", editingItem.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data Agen LPG berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from("agen_lpg")
          .insert(submitData);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data Agen LPG berhasil ditambahkan",
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
        description: "Gagal menyimpan data Agen LPG",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: AgenLpg) => {
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
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const { error } = await supabase
        .from("agen_lpg")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data Agen LPG berhasil dihapus",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data Agen LPG",
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
        <h3 className="text-lg font-semibold">Data Agen LPG</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Agen LPG
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Agen LPG" : "Tambah Agen LPG"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <TableHead>Alamat</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Penanggung Jawab</TableHead>
              <TableHead>Koordinat</TableHead>
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
                <TableCell>{item.alamat}</TableCell>
                <TableCell>{item.telepon || "-"}</TableCell>
                <TableCell>{item.penanggungjawab}</TableCell>
                <TableCell>
                  {item.latitude && item.longitude 
                    ? `${item.latitude}, ${item.longitude}` 
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