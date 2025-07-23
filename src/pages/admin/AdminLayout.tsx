import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("simdag_auth");
    const userRole = localStorage.getItem("simdag_role");
    
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur-sm">
            <div className="flex items-center px-6 py-3">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                  SIMDAG - Sistem Informasi Perdagangan Salatiga
                </h1>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">SAL</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;