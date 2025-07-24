import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart3, Monitor, TrendingUp } from "lucide-react";
import { CommodityTrendAnalytics } from "@/components/CommodityTrendAnalytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header Section */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <div className="text-center space-y-4 max-w-2xl px-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900">SIMDAG</h1>
          <h2 className="text-2xl font-semibold text-blue-800">Sistem Informasi Perdagangan Salatiga</h2>
          <p className="text-lg text-blue-600">Aplikasi monitoring dan analisis perdagangan untuk Pemerintah Kota Salatiga</p>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Dashboard Utama</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analitik Tren</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 h-16">
                    <Link to="/simdag" className="flex flex-col items-center space-y-2">
                      <Monitor className="w-6 h-6" />
                      <span>Dashboard SIMDAG</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-16">
                    <Link to="/settings" className="flex flex-col items-center space-y-2">
                      <Settings className="w-6 h-6" />
                      <span>Pengaturan Sistem</span>
                    </Link>
                  </Button>
                </div>

                <div className="text-sm text-blue-600 bg-blue-50 p-4 rounded-lg">
                  <p>💡 <strong>Tip:</strong> Gunakan toggle di dashboard untuk beralih antara tampilan mobile dan desktop admin</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="bg-white rounded-lg shadow-lg">
            <CommodityTrendAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
