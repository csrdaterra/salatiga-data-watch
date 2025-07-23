import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  getLPGAgents, 
  addLPGAgent, 
  updateLPGAgent, 
  deleteLPGAgent, 
  type LPGAgent 
} from "@/stores/lpgStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";

const lpgSchema = z.object({
  name: z.string().min(1, "Nama agen harus diisi"),
  address: z.string().min(1, "Alamat harus diisi"),
  kecamatan: z.string().optional(),
});

type LPGFormData = z.infer<typeof lpgSchema>;

const LPGSubsidized = () => {
  const [lpgAgents, setLpgAgents] = useState<LPGAgent[]>([]);
  const [editingLPG, setEditingLPG] = useState<LPGAgent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLpgAgents(getLPGAgents());
  }, []);

  const form = useForm<LPGFormData>({
    resolver: zodResolver(lpgSchema),
    defaultValues: {
      name: "",
      address: "",
      kecamatan: "",
    },
  });

  const onSubmit = (data: LPGFormData) => {
    if (editingLPG) {
      updateLPGAgent(editingLPG.id, data);
      setLpgAgents(getLPGAgents());
      toast({
        title: "Berhasil",
        description: "Data agen LPG berhasil diperbarui",
      });
    } else {
      const newAgent: LPGAgent = {
        id: Date.now(),
        name: data.name,
        address: data.address,
        kecamatan: data.kecamatan,
      };
      addLPGAgent(newAgent);
      setLpgAgents(getLPGAgents());
      toast({
        title: "Berhasil",
        description: "Agen LPG baru berhasil ditambahkan",
      });
    }
    
    form.reset();
    setEditingLPG(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (agent: LPGAgent) => {
    setEditingLPG(agent);
    form.reset({
      name: agent.name,
      address: agent.address,
      kecamatan: agent.kecamatan || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteLPGAgent(id);
    setLpgAgents(getLPGAgents());
    toast({
      title: "Berhasil",
      description: "Agen LPG berhasil dihapus",
    });
  };

  const handleAddNew = () => {
    setEditingLPG(null);
    form.reset({
      name: "",
      address: "",
      kecamatan: "",
    });
    setIsDialogOpen(true);
  };

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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Perusahaan</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama perusahaan" {...field} />
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
                <TableHead>Nama Perusahaan</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kecamatan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lpgAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.address}</TableCell>
                  <TableCell>
                    {agent.kecamatan ? (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {agent.kecamatan}
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