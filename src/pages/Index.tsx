import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Sistem Manajemen</h1>
        <p className="text-xl text-muted-foreground">Aplikasi manajemen sistem terintegrasi</p>
        
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Pengaturan Sistem</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
