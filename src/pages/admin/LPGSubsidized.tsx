import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";

const lpgSchema = z.object({
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

type LPGFormData = z.infer<typeof lpgSchema>;

interface LPGAgent {
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

const LPGSubsidized = () => {
  const [lpgAgents, setLpgAgents] = useState<LPGAgent[]>([]);
  const [editingLPG, setEditingLPG] = useState<LPGAgent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const { data: agenData, error } = await supabase
        .from("agen_lpg")
        .select("*")
        .order("nama_usaha");

      if (error) throw error;
      setLpgAgents(agenData || []);
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

  const form = useForm<LPGFormData>({
    resolver: zodResolver(lpgSchema),
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

  const onSubmit = async (data: LPGFormData) => {
    try {
      const submitData = {
        nama_usaha: data.nama_usaha,
        nomor_spbu: data.nomor_spbu,
        kecamatan: data.kecamatan,
        kelurahan: data.kelurahan,
        alamat: data.alamat,
        telepon: data.telepon || null,
        penanggungjawab: data.penanggungjawab,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      };

      if (editingLPG) {
        const { error } = await supabase
          .from("agen_lpg")
          .update(submitData)
          .eq("id", editingLPG.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data agen LPG berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from("agen_lpg")
          .insert(submitData);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Agen LPG baru berhasil ditambahkan",
        });
      }

      form.reset();
      setEditingLPG(null);
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data agen LPG",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (agent: LPGAgent) => {
    setEditingLPG(agent);
    form.reset({
      nama_usaha: agent.nama_usaha,
      nomor_spbu: agent.nomor_spbu,
      kecamatan: agent.kecamatan,
      kelurahan: agent.kelurahan,
      alamat: agent.alamat,
      telepon: agent.telepon || "",
      penanggungjawab: agent.penanggungjawab,
      latitude: agent.latitude?.toString() || "",
      longitude: agent.longitude?.toString() || "",
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
        description: "Agen LPG berhasil dihapus",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data agen LPG",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingLPG(null);
    form.reset({
      nama_usaha: "",
      nomor_spbu: "",
      kecamatan: "",
      kelurahan: "",
      alamat: "",
      telepon: "",
      penanggungjawab: "",
      latitude: "",
      longitude: "",
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">LPG Bersubsidi</h1>
          <p className="text-muted-foreground">Kelola informasi agen LPG bersubsidi</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Agen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingLPG ? "Edit Agen LPG" : "Tambah Agen LPG Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingLPG ? "Perbarui informasi agen LPG" : "Tambahkan data agen LPG baru"}
              </DialogDescription>
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
                        <Input placeholder="Masukkan nama usaha" {...field} />
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
                        <Input placeholder="Masukkan nomor SPBU" {...field} />
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
                        <Input placeholder="Masukkan kecamatan" {...field} />
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
                        <Input placeholder="Masukkan kelurahan" {...field} />
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
                        <Input placeholder="Masukkan alamat lengkap" {...field} />
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
                        <Input placeholder="Masukkan nomor telepon" {...field} />
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
                        <Input placeholder="Masukkan nama penanggung jawab" {...field} />
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
                          <Input placeholder="-7.3298" {...field} />
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
                          <Input placeholder="110.4928" {...field} />
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
                    {editingLPG ? "Perbarui" : "Tambah"}
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
            <MapPin className="w-5 h-5 mr-2" />
            Daftar Agen LPG Bersubsidi
          </CardTitle>
          <CardDescription>
            Total {lpgAgents.length} agen LPG terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lpgAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.nama_usaha}</TableCell>
                  <TableCell>{agent.nomor_spbu}</TableCell>
                  <TableCell>{agent.kecamatan}</TableCell>
                  <TableCell>{agent.kelurahan}</TableCell>
                  <TableCell>{agent.alamat}</TableCell>
                  <TableCell>{agent.telepon || "-"}</TableCell>
                  <TableCell>{agent.penanggungjawab}</TableCell>
                  <TableCell>
                    {agent.latitude && agent.longitude 
                      ? `${agent.latitude}, ${agent.longitude}` 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(agent)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(agent.id)}
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

export default LPGSubsidized;