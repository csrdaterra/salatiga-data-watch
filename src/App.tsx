import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Simdag from "./pages/Simdag";
import Settings from "./pages/Settings";
import Operator from "./pages/Operator";
import MarketDetail from "./pages/MarketDetail";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Markets from "./pages/admin/Markets";
import LargeStores from "./pages/admin/LargeStores";
import GasStations from "./pages/admin/GasStations";
import Reports from "./pages/admin/Reports";
import PriceMonitoring from "./pages/admin/PriceMonitoring";
import LPGSubsidized from "./pages/admin/LPGSubsidized";
import SpbuLpg from "./pages/admin/SpbuLpg";
import Kepokmas from "./pages/admin/Kepokmas";
import StockPangan from "./pages/admin/StockPangan";
import StockPanganReports from "./pages/admin/StockPanganReports";
import Dokapii from "./pages/admin/Dokapii";
import BbmLpg from "./pages/admin/BbmLpg";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/simdag" element={<Simdag />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/operator" element={<Operator />} />
          <Route path="/market/:marketId" element={<MarketDetail />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="markets" element={<Markets />} />
            <Route path="large-stores" element={<LargeStores />} />
            <Route path="gas-stations" element={<GasStations />} />
            <Route path="lpg-subsidized" element={<LPGSubsidized />} />
            <Route path="spbu-lpg" element={<SpbuLpg />} />
            <Route path="price-monitoring" element={<PriceMonitoring />} />
            <Route path="reports" element={<Reports />} />
            <Route path="kepokmas" element={<Kepokmas />} />
            <Route path="stock-pangan" element={<StockPangan />} />
            <Route path="stock-pangan-reports" element={<StockPanganReports />} />
            <Route path="dokapii" element={<Dokapii />} />
            <Route path="bbm-lpg" element={<BbmLpg />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
