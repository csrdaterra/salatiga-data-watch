import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package } from "lucide-react";
import CommoditySurveyForm from "@/components/CommoditySurveyForm";
import StockBapoktingForm from "@/components/StockBapoktingForm";

function OperatorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard Operator</h1>
        <p className="text-muted-foreground">
          Kelola input data komoditas dan stok pangan harian
        </p>
      </div>

      <Tabs defaultValue="kepokmas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kepokmas" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Input Komoditas Kepokmas</span>
          </TabsTrigger>
          <TabsTrigger value="stock-pangan" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Input Stok Pangan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kepokmas">
          <CommoditySurveyForm />
        </TabsContent>

        <TabsContent value="stock-pangan">
          <StockBapoktingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OperatorPage;