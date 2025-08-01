import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Store, BarChart3 } from "lucide-react";

export default function StockPangan() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stok Pangan</h1>
        <p className="text-muted-foreground">
          Kelola data stok pangan dari toko besar di Salatiga
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Toko Besar</TabsTrigger>
          <TabsTrigger value="commodities">Komoditas</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Toko Besar</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  Terdaftar di sistem
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Komoditas Aktif</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">
                  Komoditas pokok
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Laporan Bulan Ini</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Data stok tercatat
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tentang Stok Pangan</CardTitle>
              <CardDescription>
                Sistem monitoring stok pangan di toko besar Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Modul Stok Pangan memungkinkan monitoring dan pelaporan stok komoditas 
                pangan strategis di toko-toko besar di Kota Salatiga. Sistem ini membantu 
                dalam pengawasan ketersediaan pangan dan analisis tren stok.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <CardTitle>Toko Besar</CardTitle>
              <CardDescription>
                Kelola data toko besar yang menjadi sumber stok pangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Halaman untuk mengelola data toko besar akan ditampilkan di sini.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle>Komoditas Stok Pangan</CardTitle>
              <CardDescription>
                Kelola data komoditas yang dipantau stoknya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Halaman untuk mengelola komoditas stok pangan akan ditampilkan di sini.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Stok Pangan</CardTitle>
              <CardDescription>
                Laporan dengan filter harian, bulanan, tahunan, per komoditas, dan per toko
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Halaman laporan dengan berbagai filter akan ditampilkan di sini.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}