import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, BarChart3, Monitor } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center space-y-8 max-w-2xl px-6">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900">SIMDAG</h1>
          <h2 className="text-2xl font-semibold text-blue-800">Sistem Informasi Perdagangan Salatiga</h2>
          <p className="text-lg text-blue-600">Aplikasi monitoring dan analisis perdagangan untuk Pemerintah Kota Salatiga</p>
        </div>
        
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
  );
};

export default Index;
