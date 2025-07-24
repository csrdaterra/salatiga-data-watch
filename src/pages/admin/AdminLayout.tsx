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
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center px-3 sm:px-6 py-3">
              <SidebarTrigger className="mr-2 sm:mr-4" />
              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
                  SIMDAG - Sistem Informasi Perdagangan Salatiga
                </h1>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">SAL</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-6 bg-background overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;