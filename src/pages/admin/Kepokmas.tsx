import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Package, BarChart3, DollarSign, FileText } from "lucide-react";
import KepokmasTable from "@/components/KepokmasTable";
import KepokmasPriceTable from "@/components/KepokmasPriceTable";
import KepokmasReports from "@/components/KepokmasReports";

const Kepokmas = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kepokmas</h1>
          <p className="text-muted-foreground">
            Kebutuhan Pokok Masyarakat - Sistem manajemen harga komoditas esensial
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Sistem Kepokmas mengelola data 50 komoditas esensial untuk survey harga harian di berbagai pasar.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="commodities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commodities" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Data Komoditas
          </TabsTrigger>
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Harga Komoditas
          </TabsTrigger>
          <TabsTrigger value="markets" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Data Pasar
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Laporan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commodities">
          <KepokmasTable />
        </TabsContent>

        <TabsContent value="prices">
          <KepokmasPriceTable />
        </TabsContent>

        <TabsContent value="markets">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Data pasar menggunakan sistem yang sudah ada di menu Markets.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <KepokmasReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Kepokmas;