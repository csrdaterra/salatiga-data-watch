import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Building2, 
  Fuel, 
  MapPin, 
  TrendingUp, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for dashboard
const summaryData = [
  { title: "Total Pasar", value: "11", change: "Aktif", trend: "stable", icon: Store, color: "blue" },
  { title: "Toko Besar", value: "24", change: "Terdaftar", trend: "up", icon: Building2, color: "green" },
  { title: "SPBU & Pertashop", value: "18", change: "Aktif", trend: "stable", icon: Fuel, color: "orange" },
  { title: "Agen LPG", value: "32", change: "Aktif", trend: "up", icon: MapPin, color: "purple" },
];

const recentPriceData = [
  { date: "2024-01-01", beras: 12000, cabai: 25000, telur: 24000 },
  { date: "2024-01-02", beras: 12100, cabai: 26000, telur: 24500 },
  { date: "2024-01-03", beras: 12200, cabai: 27000, telur: 25000 },
  { date: "2024-01-04", beras: 12150, cabai: 26500, telur: 24800 },
  { date: "2024-01-05", beras: 12300, cabai: 28000, telur: 25200 },
];

const recentActivities = [
  { time: "10:30", action: "Data pasar Sidorejo diperbarui", status: "success" },
  { time: "09:15", action: "Tambah toko besar Alfamart Tingkir", status: "success" },
  { time: "08:45", action: "Update harga LPG 3kg", status: "warning" },
  { time: "08:20", action: "SPBU Pertamina Argomulyo offline", status: "error" },
  { time: "07:30", action: "Backup database berhasil", status: "success" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Selamat datang di SIMDAG - Sistem Informasi Perdagangan Salatiga
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {summaryData.map((item, index) => (
          <Card key={index} className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{item.value}</p>
                  <p className={`text-sm ${
                    item.color === 'green' ? 'text-green-600' : 
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'orange' ? 'text-orange-600' : 'text-purple-600'
                  }`}>
                    {item.change}
                  </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                  item.color === 'green' ? 'bg-green-100' : 
                  item.color === 'blue' ? 'bg-blue-100' :
                  item.color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    item.color === 'green' ? 'text-green-600' : 
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'orange' ? 'text-orange-600' : 'text-purple-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Price Trend Chart */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tren Harga Komoditas (5 Hari Terakhir)
            </CardTitle>
            <CardDescription>
              Pergerakan harga bahan pokok utama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Harga']}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                  />
                  <Line type="monotone" dataKey="beras" stroke="#2563eb" strokeWidth={2} name="Beras" />
                  <Line type="monotone" dataKey="cabai" stroke="#dc2626" strokeWidth={2} name="Cabai" />
                  <Line type="monotone" dataKey="telur" stroke="#059669" strokeWidth={2} name="Telur" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Clock className="w-5 h-5 mr-2" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Log aktivitas sistem hari ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 mt-0.5">
                    {activity.status === "success" && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {activity.status === "warning" && (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                    {activity.status === "error" && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={
                      activity.status === "success" ? "default" :
                      activity.status === "warning" ? "secondary" : "destructive"
                    }
                    className={
                      activity.status === "success" ? "bg-green-100 text-green-700" :
                      activity.status === "warning" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }
                  >
                    {activity.status === "success" ? "Berhasil" :
                     activity.status === "warning" ? "Peringatan" : "Error"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-3 sm:p-4 text-center">
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Kelola Pasar</h3>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Tambah atau edit data pasar</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-3 sm:p-4 text-center">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Toko Besar</h3>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Manajemen data retailer</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-3 sm:p-4 text-center">
            <Fuel className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">SPBU</h3>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Data stasiun BBM</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-3 sm:p-4 text-center">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Laporan</h3>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Generate laporan</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;