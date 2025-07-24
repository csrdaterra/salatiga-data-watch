import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart3, Monitor, TrendingUp, UserCheck, BookOpen } from "lucide-react";
import { CommodityTrendAnalytics } from "@/components/CommodityTrendAnalytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header Section */}
      <div className="flex items-center justify-center pt-6 sm:pt-8 pb-4">
        <div className="text-center space-y-3 sm:space-y-4 max-w-2xl px-4 sm:px-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">SIMDAG</h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-800">Sistem Informasi Perdagangan Salatiga</h2>
          <p className="text-sm sm:text-base lg:text-lg text-blue-600">Aplikasi monitoring dan analisis perdagangan untuk Pemerintah Kota Salatiga</p>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 pb-6 sm:pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 h-auto">
            <TabsTrigger value="overview" className="flex items-center space-x-1 sm:space-x-2 py-2">
              <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Dashboard Utama</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-1 sm:space-x-2 py-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Analitik Tren</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-4 sm:space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 h-12 sm:h-16">
                    <Link to="/simdag" className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <Monitor className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="text-xs sm:text-sm">Dashboard SIMDAG</span>
                    </Link>
                  </Button>
                  
                  <Button asChild className="bg-green-600 hover:bg-green-700 h-12 sm:h-16">
                    <Link to="/operator" className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <UserCheck className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="text-xs sm:text-sm">Portal Operator</span>
                    </Link>
                  </Button>

                  <Button asChild className="bg-purple-600 hover:bg-purple-700 h-12 sm:h-16">
                    <Link to="/training" className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="text-xs sm:text-sm">Training & Panduan</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-12 sm:h-16">
                    <Link to="/settings" className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <Settings className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="text-xs sm:text-sm">Pengaturan Sistem</span>
                    </Link>
                  </Button>
                </div>

                <div className="text-xs sm:text-sm text-blue-600 bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p>💡 <strong>Tip:</strong> Aplikasi ini dioptimalkan untuk smartphone dan tablet. Akses Training untuk panduan lengkap.</p>
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
