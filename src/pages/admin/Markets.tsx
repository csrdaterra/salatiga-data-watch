
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Store, Package, Link, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getMarkets, setMarkets, type Market } from "@/stores/marketStore";
import {
  getCommodities,
  setCommodities,
  addCommodity,
  updateCommodity,
  deleteCommodity,
  getMarketCommodities,
  getCommoditiesByMarket,
  getMarketsByCommodity,
  addMarketCommodity,
  removeMarketCommodity,
  getCommodityAvailabilitySummary,
  type CommodityCategory,
  type MarketCommodity
} from "@/stores/commodityStore";

const marketSchema = z.object({
  name: z.string().min(1, "Nama pasar wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contact: z.string().min(1, "Kontak wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
});

const commoditySchema = z.object({
  name: z.string().min(1, "Nama komoditas wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
});

type MarketFormData = z.infer<typeof marketSchema>;
type CommodityFormData = z.infer<typeof commoditySchema>;

const Markets = () => {
  const { toast } = useToast();
  const [markets, setMarketsState] = useState<Market[]>([]);
  const [commodities, setCommoditiesState] = useState<CommodityCategory[]>([]);
  const [marketCommodities, setMarketCommoditiesState] = useState<MarketCommodity[]>([]);
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [editingCommodity, setEditingCommodity] = useState<CommodityCategory | null>(null);
  const [isMarketDialogOpen, setIsMarketDialogOpen] = useState(false);
  const [isCommodityDialogOpen, setIsCommodityDialogOpen] = useState(false);
  const [isRelationDialogOpen, setIsRelationDialogOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  useEffect(() => {
    setMarketsState(getMarkets());
    setCommoditiesState(getCommodities());
    setMarketCommoditiesState(getMarketCommodities());
  }, []);

  const marketForm = useForm<MarketFormData>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      address: "",
      contact: "",
      longitude: "",
      latitude: "",
      kecamatan: "",
    },
  });

  const commodityForm = useForm<CommodityFormData>({
    resolver: zodResolver(commoditySchema),
    defaultValues: {
      name: "",
      description: "",
      unit: "",
    },
  });

  const onMarketSubmit = (data: MarketFormData) => {
    if (editingMarket) {
      const updatedMarkets = markets.map(market => 
        market.id === editingMarket.id 
          ? { ...market, ...data }
          : market
      );
      setMarkets(updatedMarkets);
      setMarketsState(updatedMarkets);
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
        kecamatan: data.kecamatan,
      };
      const updatedMarkets = [...markets, newMarket];
      setMarkets(updatedMarkets);
      setMarketsState(updatedMarkets);
      toast({
        title: "Berhasil",
        description: "Data pasar berhasil ditambahkan",
      });
    }
    
    marketForm.reset();
    setEditingMarket(null);
    setIsMarketDialogOpen(false);
  };

  const onCommoditySubmit = (data: CommodityFormData) => {
    if (editingCommodity) {
      updateCommodity(editingCommodity.id, data);
      setCommoditiesState(getCommodities());
      toast({
        title: "Berhasil",
        description: "Data komoditas berhasil diperbarui",
      });
    } else {
      const newCommodity: CommodityCategory = {
        id: Date.now(),
        name: data.name,
        description: data.description,
        unit: data.unit,
        category: "lainnya",
      };
      addCommodity(newCommodity);
      setCommoditiesState(getCommodities());
      toast({
        title: "Berhasil",
        description: "Data komoditas berhasil ditambahkan",
      });
    }
    
    commodityForm.reset();
    setEditingCommodity(null);
    setIsCommodityDialogOpen(false);
  };

  const handleEditMarket = (market: Market) => {
    setEditingMarket(market);
    marketForm.reset(market);
    setIsMarketDialogOpen(true);
  };

  const handleDeleteMarket = (id: number) => {
    const updatedMarkets = markets.filter(market => market.id !== id);
    setMarkets(updatedMarkets);
    setMarketsState(updatedMarkets);
    toast({
      title: "Berhasil",
      description: "Data pasar berhasil dihapus",
    });
  };

  const handleEditCommodity = (commodity: CommodityCategory) => {
    setEditingCommodity(commodity);
    commodityForm.reset(commodity);
    setIsCommodityDialogOpen(true);
  };

  const handleDeleteCommodity = (id: number) => {
    deleteCommodity(id);
    setCommoditiesState(getCommodities());
    setMarketCommoditiesState(getMarketCommodities());
    toast({
      title: "Berhasil",
      description: "Data komoditas berhasil dihapus",
    });
  };

  const handleAddNewMarket = () => {
    setEditingMarket(null);
    marketForm.reset();
    setIsMarketDialogOpen(true);
  };

  const handleAddNewCommodity = () => {
    setEditingCommodity(null);
    commodityForm.reset();
    setIsCommodityDialogOpen(true);
  };

  const handleManageRelations = (market: Market) => {
    setSelectedMarket(market);
    setIsRelationDialogOpen(true);
  };

  const handleCommodityToggle = (commodityId: number, checked: boolean) => {
    if (!selectedMarket) return;

    if (checked) {
      addMarketCommodity({
        marketId: selectedMarket.id,
        commodityId: commodityId,
        availability: true
      });
    } else {
      removeMarketCommodity(selectedMarket.id, commodityId);
    }
    
    setMarketCommoditiesState(getMarketCommodities());
  };

  const getMarketCommodityList = (marketId: number) => {
    return getCommoditiesByMarket(marketId);
  };

  const isMarketHasCommodity = (marketId: number, commodityId: number) => {
    return marketCommodities.some(
      mc => mc.marketId === marketId && mc.commodityId === commodityId && mc.availability
    );
  };

  const availabilitySummary = getCommodityAvailabilitySummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Pasar & Komoditas</h1>
          <p className="text-muted-foreground">Kelola informasi pasar tradisional dan kategori komoditas</p>
        </div>
      </div>

      <Tabs defaultValue="markets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="markets" className="flex items-center space-x-2">
            <Store className="w-4 h-4" />
            <span>Data Pasar</span>
          </TabsTrigger>
          <TabsTrigger value="commodities" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Kategori Komoditas</span>
          </TabsTrigger>
          <TabsTrigger value="relations" className="flex items-center space-x-2">
            <Link className="w-4 h-4" />
            <span>Komoditas per Pasar</span>
          </TabsTrigger>
        </TabsList>

        {/* Markets Tab */}
        <TabsContent value="markets">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isMarketDialogOpen} onOpenChange={setIsMarketDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddNewMarket} className="flex items-center space-x-2">
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
                  <Form {...marketForm}>
                    <form onSubmit={marketForm.handleSubmit(onMarketSubmit)} className="space-y-4">
                      <FormField
                        control={marketForm.control}
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
                        control={marketForm.control}
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
                        control={marketForm.control}
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
                        control={marketForm.control}
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
                                <SelectItem value="Sidomulyo">Sidomulyo</SelectItem>
                                <SelectItem value="Tingkir">Tingkir</SelectItem>
                                <SelectItem value="Argomulyo">Argomulyo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={marketForm.control}
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
                          control={marketForm.control}
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
                        <Button type="button" variant="outline" onClick={() => setIsMarketDialogOpen(false)}>
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
                      <TableHead>Kecamatan</TableHead>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead className="w-[160px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {markets.map((market) => {
                      const marketCommodityList = getMarketCommodityList(market.id);
                      return (
                        <TableRow key={market.id}>
                          <TableCell className="font-medium">{market.name}</TableCell>
                          <TableCell>{market.address}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {market.kecamatan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {marketCommodityList.slice(0, 3).map((commodity) => (
                                <Badge key={commodity.id} variant="outline" className="text-xs">
                                  {commodity.name}
                                </Badge>
                              ))}
                              {marketCommodityList.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{marketCommodityList.length - 3} lainnya
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{market.contact}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleManageRelations(market)}
                              >
                                <Link className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMarket(market)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteMarket(market.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Commodities Tab */}
        <TabsContent value="commodities">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isCommodityDialogOpen} onOpenChange={setIsCommodityDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddNewCommodity} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Komoditas</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCommodity ? "Edit Komoditas" : "Tambah Komoditas Baru"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCommodity ? "Perbarui informasi komoditas" : "Tambahkan kategori komoditas baru"}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...commodityForm}>
                    <form onSubmit={commodityForm.handleSubmit(onCommoditySubmit)} className="space-y-4">
                      <FormField
                        control={commodityForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Komoditas</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan nama komoditas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={commodityForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan deskripsi komoditas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={commodityForm.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Satuan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih satuan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="liter">Liter</SelectItem>
                                <SelectItem value="buah">Buah</SelectItem>
                                <SelectItem value="ikat">Ikat</SelectItem>
                                <SelectItem value="gram">Gram</SelectItem>
                                <SelectItem value="ekor">Ekor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCommodityDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button type="submit">
                          {editingCommodity ? "Perbarui" : "Tambah"}
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
                  <Package className="w-5 h-5 mr-2" />
                  Kategori Komoditas
                </CardTitle>
                <CardDescription>
                  Total {commodities.length} kategori komoditas terdaftar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Komoditas</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead>Ketersediaan</TableHead>
                      <TableHead className="w-[120px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commodities.map((commodity) => {
                      const availability = availabilitySummary[commodity.name] || { availableMarkets: 0, totalMarkets: 0 };
                      return (
                        <TableRow key={commodity.id}>
                          <TableCell className="font-medium">{commodity.name}</TableCell>
                          <TableCell>{commodity.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{commodity.unit}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {availability.availableMarkets} dari {availability.totalMarkets} pasar
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCommodity(commodity)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCommodity(commodity.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Relations Tab */}
        <TabsContent value="relations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {markets.map((market) => {
              const marketCommodityList = getMarketCommodityList(market.id);
              return (
                <Card key={market.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Store className="w-5 h-5 mr-2" />
                        {market.name}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageRelations(market)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Kelola
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {market.kecamatan} - {marketCommodityList.length} komoditas tersedia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {marketCommodityList.length > 0 ? (
                        marketCommodityList.map((commodity) => (
                          <div key={commodity.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div>
                              <span className="font-medium">{commodity.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {commodity.unit}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">Belum ada komoditas yang terdaftar</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Market-Commodity Relation Dialog */}
      <Dialog open={isRelationDialogOpen} onOpenChange={setIsRelationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Kelola Komoditas - {selectedMarket?.name}
            </DialogTitle>
            <DialogDescription>
              Pilih komoditas yang tersedia di pasar ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {commodities.map((commodity) => {
              const isChecked = selectedMarket ? isMarketHasCommodity(selectedMarket.id, commodity.id) : false;
              return (
                <div key={commodity.id} className="flex items-center space-x-3 p-3 border rounded">
                  <Checkbox
                    id={`commodity-${commodity.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleCommodityToggle(commodity.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor={`commodity-${commodity.id}`} className="font-medium cursor-pointer">
                      {commodity.name}
                    </label>
                    <p className="text-sm text-muted-foreground">{commodity.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {commodity.unit}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsRelationDialogOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Markets;
