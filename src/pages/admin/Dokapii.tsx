import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code2, 
  Book, 
  Key, 
  Server, 
  Database,
  ArrowRight,
  Copy,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dokapii = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    toast({
      title: "Berhasil disalin!",
      description: "Endpoint telah disalin ke clipboard",
    });
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/commodity-api",
      title: "Get All Commodities",
      description: "Mengambil semua data komoditas yang tersedia",
      parameters: [
        { name: "limit", type: "number", required: false, description: "Jumlah data yang diambil (default: 50)" },
        { name: "offset", type: "number", required: false, description: "Offset data (default: 0)" }
      ],
      response: {
        "success": true,
        "data": [
          {
            "id": "1",
            "name": "Beras Premium",
            "category": "Beras",
            "unit": "kg",
            "price": 12000,
            "market": "Pasar Argomulyo",
            "updated_at": "2024-01-15T10:30:00Z"
          }
        ]
      }
    },
    {
      method: "GET", 
      path: "/commodity-api/{id}",
      title: "Get Commodity by ID",
      description: "Mengambil data komoditas berdasarkan ID tertentu",
      parameters: [
        { name: "id", type: "string", required: true, description: "ID komoditas" }
      ],
      response: {
        "success": true,
        "data": {
          "id": "1",
          "name": "Beras Premium",
          "category": "Beras",
          "unit": "kg",
          "price": 12000,
          "market": "Pasar Argomulyo",
          "updated_at": "2024-01-15T10:30:00Z"
        }
      }
    },
    {
      method: "POST",
      path: "/commodity-api",
      title: "Create New Commodity",
      description: "Menambahkan data komoditas baru",
      parameters: [
        { name: "name", type: "string", required: true, description: "Nama komoditas" },
        { name: "category", type: "string", required: true, description: "Kategori komoditas" },
        { name: "unit", type: "string", required: true, description: "Satuan (kg, liter, dll)" },
        { name: "price", type: "number", required: true, description: "Harga dalam rupiah" },
        { name: "market", type: "string", required: true, description: "Nama pasar" }
      ],
      response: {
        "success": true,
        "message": "Komoditas berhasil ditambahkan",
        "data": {
          "id": "new_id",
          "name": "Cabai Merah",
          "category": "Sayuran",
          "unit": "kg",
          "price": 25000,
          "market": "Pasar Sidorejo"
        }
      }
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Dokapii</h1>
          <Badge variant="secondary" className="text-xs">v1.0</Badge>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Dokumentasi API Komoditas SIMDAG - Endpoint untuk mengakses data harga komoditas
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
            <Book className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="text-xs sm:text-sm py-2">
            <Server className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="auth" className="text-xs sm:text-sm py-2">
            <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="examples" className="text-xs sm:text-sm py-2">
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Examples
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Base URL</CardTitle>
              <CardDescription>URL dasar untuk semua endpoint API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 sm:p-4 rounded-lg font-mono text-sm break-all">
                https://snfgnsiyieognthvpyto.supabase.co/functions/v1
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-600" />
                  Data Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">JSON format dengan struktur yang konsisten untuk semua response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Key className="w-5 h-5 mr-2 text-green-600" />
                  Rate Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">1000 requests per hour untuk setiap API key</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Server className="w-5 h-5 mr-2 text-purple-600" />
                  Status Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>200</span>
                    <span className="text-muted-foreground">Success</span>
                  </div>
                  <div className="flex justify-between">
                    <span>401</span>
                    <span className="text-muted-foreground">Unauthorized</span>
                  </div>
                  <div className="flex justify-between">
                    <span>404</span>
                    <span className="text-muted-foreground">Not Found</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'secondary' : 'outline'}>
                      {endpoint.method}
                    </Badge>
                    <CardTitle className="text-base sm:text-lg">{endpoint.title}</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                    className="self-start sm:self-center"
                  >
                    {copiedEndpoint === endpoint.path ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-3 rounded-lg font-mono text-sm break-all">
                  <span className="text-blue-600">{endpoint.method}</span> {endpoint.path}
                </div>
                
                {endpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Parameters:</h4>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <code className="bg-muted px-2 py-1 rounded text-xs">{param.name}</code>
                          <Badge variant="outline" className="text-xs self-start">{param.type}</Badge>
                          {param.required && <Badge variant="destructive" className="text-xs self-start">Required</Badge>}
                          <span className="text-muted-foreground">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm mb-2">Response:</h4>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(endpoint.response, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="auth" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">API Key Authentication</CardTitle>
              <CardDescription>
                Gunakan API key untuk mengakses semua endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Header Required:</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">API Key:</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs break-all">
                  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZmduc2l5aWVvZ250aHZweXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODMwOTAsImV4cCI6MjA2ODg1OTA5MH0.h1QMyDalwQp6ABPyoTeZ5OTy6uIXOe2mNzM1azexo1c
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> Jangan bagikan API key Anda kepada siapapun. Simpan dengan aman dan gunakan hanya untuk aplikasi yang diperlukan.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">JavaScript/Fetch Example</CardTitle>
              <CardDescription>Contoh implementasi menggunakan JavaScript fetch API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Get all commodities
const response = await fetch(
  'https://snfgnsiyieognthvpyto.supabase.co/functions/v1/commodity-api',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data);`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">cURL Example</CardTitle>
              <CardDescription>Contoh implementasi menggunakan cURL</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`# Get all commodities
curl -X GET \\
  https://snfgnsiyieognthvpyto.supabase.co/functions/v1/commodity-api \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Create new commodity
curl -X POST \\
  https://snfgnsiyieognthvpyto.supabase.co/functions/v1/commodity-api \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Cabai Merah",
    "category": "Sayuran", 
    "unit": "kg",
    "price": 25000,
    "market": "Pasar Sidorejo"
  }'`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dokapii;