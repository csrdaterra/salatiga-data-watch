import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, BarChart3, TrendingUp } from "lucide-react";
import { AgenRealisasiBbmTable } from "@/components/AgenRealisasiBbmTable";
import { AgenRealisasiGas3kgTable } from "@/components/AgenRealisasiGas3kgTable";

const BbmLpgPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">BBM LPG</h1>
        <p className="text-muted-foreground">
          Manajemen data realisasi BBM dan Gas 3kg di Kota Salatiga
        </p>
      </div>

      <Tabs defaultValue="bbm-realisasi" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bbm-realisasi" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Realisasi BBM
          </TabsTrigger>
          <TabsTrigger value="gas-3kg" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Realisasi Gas 3kg
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bbm-realisasi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Realisasi BBM</CardTitle>
              <CardDescription>
                Daftar realisasi BBM agen yang terdaftar di Kota Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgenRealisasiBbmTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gas-3kg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Realisasi Gas 3kg</CardTitle>
              <CardDescription>
                Daftar realisasi Gas 3kg agen yang terdaftar di Kota Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgenRealisasiGas3kgTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BbmLpgPage;