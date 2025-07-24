import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText } from "lucide-react";
import CommoditySurveyForm from "@/components/CommoditySurveyForm";
import SurveyResultsTable from "@/components/SurveyResultsTable";

function OperatorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="survey" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="survey" className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4" />
            <span>Input Survey Harga</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Hasil Survey</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="survey">
          <CommoditySurveyForm />
        </TabsContent>

        <TabsContent value="results">
          <SurveyResultsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OperatorPage;