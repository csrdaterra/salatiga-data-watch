import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SimdagDashboard from "@/components/SimdagDashboard";
import SimdagDesktopAdmin from "@/components/SimdagDesktopAdmin";
import { Monitor, Smartphone } from "lucide-react";

const Simdag = () => {
  const [isDesktopView, setIsDesktopView] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* View Toggle */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <Switch
            checked={isDesktopView}
            onCheckedChange={setIsDesktopView}
            id="view-toggle"
          />
          <Monitor className="w-4 h-4 text-blue-600" />
          <Label htmlFor="view-toggle" className="text-sm font-medium">
            {isDesktopView ? "Desktop Admin" : "Mobile View"}
          </Label>
        </div>
      </div>

      {/* Content */}
      {isDesktopView ? <SimdagDesktopAdmin /> : <SimdagDashboard />}
    </div>
  );
};

export default Simdag;