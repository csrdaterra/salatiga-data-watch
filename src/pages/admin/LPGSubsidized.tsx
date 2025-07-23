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
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const lpgSchema = z.object({
  agentName: z.string().min(1, "Nama agen wajib diisi"),
  ownerName: z.string().min(1, "Nama pemilik wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contact: z.string().min(1, "Kontak wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
});

type LPGFormData = z.infer<typeof lpgSchema>;

interface LPGAgent {
  id: number;
  agentName: string;
  ownerName: string;
  address: string;
  contact: string;
  longitude: string;
  latitude: string;
}

const LPGSubsidized = () => {
  const { toast } = useToast();
  const [lpgAgents, setLpgAgents] = useState<LPGAgent[]>([
    {
      id: 1,
      agentName: "Agen LPG Sumber Rejeki",
      ownerName: "Bambang Sutrisno",
      address: "Jl. Merdeka No. 34, Salatiga",
      contact: "0298-334455",
      longitude: "110.4823",
      latitude: "-7.3267"
    },
    {
      id: 2,
      agentName: "Agen Gas Barokah",
      ownerName: "Endang Sari",
      address: "Jl. Veteran No. 78, Salatiga",
      contact: "0298-335566",
      longitude: "110.4967",
      latitude: "-7.3289"
    },
    {
      id: 3,
      agentName: "Agen LPG Makmur",
      ownerName: "Hadi Prasetyo",
      address: "Jl. Hasanuddin No. 56, Salatiga",
      contact: "0298-336677",
      longitude: "110.4889",
      latitude: "-7.3312"
    }
  ]);
  const [editingLPG, setEditingLPG] = useState<LPGAgent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<LPGFormData>({
    resolver: zodResolver(lpgSchema),
    defaultValues: {
      agentName: "",
      ownerName: "",
      address: "",
      contact: "",
      longitude: "",
      latitude: "",
    },
  });

  const onSubmit = (data: LPGFormData) => {
    if (editingLPG) {
      setLpgAgents(lpgAgents.map(agent => 
        agent.id === editingLPG.id 
          ? { ...agent, ...data }
          : agent
      ));
      toast({
        title: "Berhasil",
        description: "Data agen LPG berhasil diperbarui",
      });
    } else {
      const newLPGAgent: LPGAgent = {
        id: Date.now(),
        agentName: data.agentName,
        ownerName: data.ownerName,
        address: data.address,
        contact: data.contact,
        longitude: data.longitude,
        latitude: data.latitude,
      };
      setLpgAgents([...lpgAgents, newLPGAgent]);
      toast({
        title: "Berhasil",
        description: "Data agen LPG berhasil ditambahkan",
      });
    }
    
    form.reset();
    setEditingLPG(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lpgAgent: LPGAgent) => {
    setEditingLPG(lpgAgent);
    form.reset(lpgAgent);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setLpgAgents(lpgAgents.filter(agent => agent.id !== id));
    toast({
      title: "Berhasil",
      description: "Data agen LPG berhasil dihapus",
    });
  };

  const handleAddNew = () => {
    setEditingLPG(null);
    form.reset();
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
              <span>Tambah Agen LPG</span>
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
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Agen</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama agen LPG" {...field} />
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
                        <Input placeholder="Masukkan alamat agen" {...field} />
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
                <TableHead>Nama Agen</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lpgAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.agentName}</TableCell>
                  <TableCell>{agent.ownerName}</TableCell>
                  <TableCell>{agent.address}</TableCell>
                  <TableCell>{agent.contact}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {agent.latitude}, {agent.longitude}
                    </span>
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