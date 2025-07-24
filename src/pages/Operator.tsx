import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, BarChart3, Package } from "lucide-react";
import CommoditySurveyForm from "@/components/CommoditySurveyForm";
import SurveyResultsTable from "@/components/SurveyResultsTable";
import SurveyAnalytics from "@/components/SurveyAnalytics";
import StockBapoktingForm from "@/components/StockBapoktingForm";
import StockBapoktingTable from "@/components/StockBapoktingTable";

function OperatorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="survey" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="survey" className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4" />
            <span>Input Survey Harga</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Hasil Survey</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analisa & Statistik</span>
          </TabsTrigger>
          <TabsTrigger value="stock-bapokting" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Input Stok Bapokting</span>
          </TabsTrigger>
          <TabsTrigger value="stock-table" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Data Stok Bapokting</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="survey">
          <CommoditySurveyForm />
        </TabsContent>

        <TabsContent value="results">
          <SurveyResultsTable />
        </TabsContent>

        <TabsContent value="analytics">
          <SurveyAnalytics />
        </TabsContent>

        <TabsContent value="stock-bapokting">
          <StockBapoktingForm />
        </TabsContent>

        <TabsContent value="stock-table">
          <StockBapoktingTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OperatorPage;