import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Eye, BarChart3, TrendingUp, FileText } from "lucide-react";
import CommoditySurveyForm from "@/components/CommoditySurveyForm";
import StockPanganForm from "@/components/StockPanganForm";
import KepokmasPreviewTable from "@/components/KepokmasPreviewTable";
import StockPanganPreviewTable from "@/components/StockPanganPreviewTable";
import KepokmasAnalytics from "@/components/KepokmasAnalytics";
import OperatorReports from "@/components/OperatorReports";

function OperatorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard Operator</h1>
        <p className="text-muted-foreground">
          Kelola input data komoditas, stok pangan harian, dan analitik kepokmas
        </p>
      </div>

      <Tabs defaultValue="kepokmas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="kepokmas" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Input Kepokmas</span>
          </TabsTrigger>
          <TabsTrigger value="stock-pangan" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Input Stok Pangan</span>
          </TabsTrigger>
          <TabsTrigger value="preview-kepokmas" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview Kepokmas</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analitik Kepokmas</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Laporan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kepokmas">
          <CommoditySurveyForm />
        </TabsContent>

        <TabsContent value="stock-pangan">
          <StockPanganForm />
        </TabsContent>

        <TabsContent value="preview-kepokmas">
          <KepokmasPreviewTable />
        </TabsContent>

        <TabsContent value="analytics">
          <KepokmasAnalytics />
        </TabsContent>

        <TabsContent value="reports">
          <OperatorReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OperatorPage;