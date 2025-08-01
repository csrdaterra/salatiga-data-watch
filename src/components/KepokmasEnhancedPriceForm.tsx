import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Store, Package, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const priceFormSchema = z.object({
  market_id: z.string().min(1, "Pilih pasar"),
  commodity_id: z.string().min(1, "Pilih komoditas"),
  price: z.string().min(1, "Masukkan harga"),
  stock_status: z.string().min(1, "Pilih status stok"),
  quality: z.string().min(1, "Pilih kualitas"),
  operator_name: z.string().min(1, "Nama operator wajib diisi"),
  notes: z.string().optional(),
  survey_date: z.string().min(1, "Tanggal survey wajib diisi"),
});

type PriceFormData = z.infer<typeof priceFormSchema>;

interface Market {
  id: number;
  name: string;
  address: string;
}

interface Commodity {
  id: number;
  name: string;
  unit: string;
  category: string;
}

const KepokmasEnhancedPriceForm = () => {
  const { toast } = useToast();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<PriceFormData>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      market_id: "",
      commodity_id: "",
      price: "",
      stock_status: "",
      quality: "",
      operator_name: "",
      notes: "",
      survey_date: new Date().toISOString().split('T')[0],
    },
  });

  const loadMarkets = async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('id, name, address')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pasar",
        variant: "destructive"
      });
    }
  };

  const loadCommoditiesForMarket = async (marketId: string) => {
    try {
      // For now, load all commodities since we don't have market_commodities table implemented yet
      const { data, error } = await supabase
        .from('commodities')
        .select('id, name, unit, category')
        .eq('is_essential', true)
        .order('name');

      if (error) throw error;
      setCommodities(data || []);
    } catch (error) {
      console.error('Error loading commodities:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data komoditas",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  useEffect(() => {
    if (selectedMarket) {
      loadCommoditiesForMarket(selectedMarket);
      form.setValue('commodity_id', ''); // Reset commodity selection
    } else {
      setCommodities([]);
    }
  }, [selectedMarket, form]);

  const onSubmit = async (data: PriceFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_surveys')
        .insert({
          market_id: parseInt(data.market_id),
          commodity_id: parseInt(data.commodity_id),
          price: parseFloat(data.price),
          stock_status: data.stock_status,
          quality: data.quality,
          operator_name: data.operator_name,
          notes: data.notes || null,
          survey_date: data.survey_date,
        });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data survey harga berhasil disimpan",
      });

      form.reset({
        market_id: selectedMarket, // Keep market selected
        commodity_id: "",
        price: "",
        stock_status: "",
        quality: "",
        operator_name: data.operator_name, // Keep operator name
        notes: "",
        survey_date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error saving price survey:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data survey",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarketChange = (value: string) => {
    setSelectedMarket(value);
    form.setValue('market_id', value);
  };

  const formatPrice = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <DollarSign className="h-6 w-6" />
        <div>
          <h2 className="text-2xl font-bold">Input Survey Harga</h2>
          <p className="text-muted-foreground">Masukkan data survey harga komoditas per pasar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Survey Harga</CardTitle>
              <CardDescription>
                Pilih pasar terlebih dahulu untuk melihat daftar komoditas yang perlu disurvey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="survey_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Tanggal Survey
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="operator_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Operator</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama operator" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="market_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          Pilih Pasar
                        </FormLabel>
                        <Select onValueChange={handleMarketChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih pasar untuk survey" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {markets.map((market) => (
                              <SelectItem key={market.id} value={market.id.toString()}>
                                {market.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedMarket && (
                    <FormField
                      control={form.control}
                      name="commodity_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Pilih Komoditas
                            <Badge variant="secondary">{commodities.length} tersedia</Badge>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih komoditas yang akan disurvey" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {commodities.map((commodity) => (
                                <SelectItem key={commodity.id} value={commodity.id.toString()}>
                                  {commodity.name} ({commodity.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga (Rp)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          {field.value && (
                            <p className="text-sm text-muted-foreground">
                              Rp {formatPrice(field.value)}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Stok</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Tersedia</SelectItem>
                              <SelectItem value="limited">Terbatas</SelectItem>
                              <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kualitas</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kualitas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Sangat Baik</SelectItem>
                              <SelectItem value="good">Baik</SelectItem>
                              <SelectItem value="average">Cukup</SelectItem>
                              <SelectItem value="poor">Kurang</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tambahkan catatan survey..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Menyimpan...' : 'Simpan Survey'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Panduan Survey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">Status Stok:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><Badge variant="outline" className="mr-2">Tersedia</Badge>Stok mencukupi</p>
                  <p><Badge variant="outline" className="mr-2">Terbatas</Badge>Stok sedikit</p>
                  <p><Badge variant="outline" className="mr-2">Tidak Tersedia</Badge>Stok habis</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Kualitas:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><Badge variant="outline" className="mr-2">Sangat Baik</Badge>Kondisi prima</p>
                  <p><Badge variant="outline" className="mr-2">Baik</Badge>Kondisi baik</p>
                  <p><Badge variant="outline" className="mr-2">Cukup</Badge>Kondisi standar</p>
                  <p><Badge variant="outline" className="mr-2">Kurang</Badge>Kondisi kurang</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedMarket && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Info Pasar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {markets.find(m => m.id.toString() === selectedMarket)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {markets.find(m => m.id.toString() === selectedMarket)?.address}
                  </p>
                  <Badge variant="secondary">
                    {commodities.length} komoditas tersedia
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KepokmasEnhancedPriceForm;