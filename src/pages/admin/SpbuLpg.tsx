import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, MapPin, Building2, Zap } from "lucide-react";
import { SpbuLpgTable } from "@/components/SpbuLpgTable";
import { AgenLpgTable } from "@/components/AgenLpgTable";
import { PangkalanLpgTable } from "@/components/PangkalanLpgTable";
import { SpbeTable } from "@/components/SpbeTable";

const SpbuLpgPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SPBU LPG</h1>
        <p className="text-muted-foreground">
          Manajemen data SPBU LPG, Agen LPG, Pangkalan LPG, dan SPBE di Kota Salatiga
        </p>
      </div>

      <Tabs defaultValue="spbu-lpg" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spbu-lpg" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            SPBU LPG
          </TabsTrigger>
          <TabsTrigger value="agen-lpg" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Agen LPG
          </TabsTrigger>
          <TabsTrigger value="pangkalan-lpg" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pangkalan LPG
          </TabsTrigger>
          <TabsTrigger value="spbe" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            SPBE
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spbu-lpg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data SPBU LPG</CardTitle>
              <CardDescription>
                Daftar SPBU LPG yang terdaftar di Kota Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpbuLpgTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agen-lpg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Agen LPG</CardTitle>
              <CardDescription>
                Daftar Agen LPG yang terdaftar di Kota Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgenLpgTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pangkalan-lpg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Pangkalan LPG</CardTitle>
              <CardDescription>
                Daftar Pangkalan LPG yang terdaftar di Kota Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PangkalanLpgTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spbe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data SPBE</CardTitle>
              <CardDescription>
                Daftar SPBE yang terdaftar di Kota Salatiga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpbeTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpbuLpgPage;