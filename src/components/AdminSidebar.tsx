import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Settings,
  Store,
  Building2,
  Fuel,
  MapPin,
  TrendingUp,
  Users,
  FileText,
  LogOut,
  BookOpen,
  Code2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Training", url: "/training", icon: BookOpen },
  { title: "Dokapii", url: "/admin/dokapii", icon: Code2 },
  { title: "Kepokmas", url: "/admin/kepokmas", icon: Package },
  { title: "Pengaturan Sistem", url: "/admin/settings", icon: Settings },
  { title: "Data Pasar", url: "/admin/markets", icon: Store },
  { title: "Toko Besar", url: "/admin/large-stores", icon: Building2 },
  { title: "SPBU & Pertashop", url: "/admin/gas-stations", icon: Fuel },
  { title: "LPG Bersubsidi", url: "/admin/lpg-subsidized", icon: MapPin },
  { title: "Monitoring Harga", url: "/admin/price-monitoring", icon: TrendingUp },
  { title: "Laporan", url: "/admin/reports", icon: FileText },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isExpanded = menuItems.some((item) => isActive(item.url));

  const handleLogout = () => {
    localStorage.removeItem("simdag_auth");
    localStorage.removeItem("simdag_role");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/");
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className="border-r bg-background/95 backdrop-blur-sm"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-primary">SIMDAG Admin</h2>
                <p className="text-xs text-muted-foreground">Dashboard Administrasi</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto border-t p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-secondary-foreground" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Administrator</p>
                  <p className="text-xs text-muted-foreground truncate">admin@salatiga.go.id</p>
                </div>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className={`w-full justify-start text-muted-foreground hover:text-foreground ${
                collapsed ? 'px-2' : ''
              }`}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Keluar</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}