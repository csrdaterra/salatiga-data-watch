import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCommodities } from "@/stores/commodityStore";

const TrendAnalytics = () => {
  const commodities = getCommodities();
  const categories = [...new Set(commodities.map(c => c.category))];

  // Generate weekly commodity data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    return {
      day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      date: date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
      beras: Math.floor(12000 + Math.random() * 2000 - 1000),
      daging: Math.floor(45000 + Math.random() * 8000 - 4000),
      cabai: Math.floor(35000 + Math.random() * 10000 - 5000),
      'minyak goreng': Math.floor(18000 + Math.random() * 3000 - 1500),
      'gula pasir': Math.floor(15000 + Math.random() * 2000 - 1000),
      bawang: Math.floor(25000 + Math.random() * 8000 - 4000),
    };
  });

  // Weekly price comparison analysis
  const weeklyComparison = categories.map(category => {
    const thisWeek = weeklyData.slice(-3).reduce((sum, day) => sum + (day[category as keyof typeof day] as number || 0), 0) / 3;
    const lastWeek = weeklyData.slice(0, 3).reduce((sum, day) => sum + (day[category as keyof typeof day] as number || 0), 0) / 3;
    const change = thisWeek - lastWeek;
    const changePercent = ((change / lastWeek) * 100);

    return {
      category,
      thisWeek: Math.round(thisWeek),
      lastWeek: Math.round(lastWeek),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 100) / 100,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-bold text-foreground">
          Analisis Tren Harga Komoditas
        </h3>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Monitoring pergerakan harga dan analisis tren mingguan komoditas pasar di Salatiga
        </p>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Grafik Harga 7 Hari Terakhir per Kategori
          </CardTitle>
          <CardDescription>
            Pergerakan harga komoditas utama dalam seminggu terakhir berdasarkan kategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`Rp ${value.toLocaleString('id-ID')}`, name]}
                  labelFormatter={(label) => `Hari: ${label}`}
                />
                <Legend />
                {categories.slice(0, 6).map((category, index) => (
                  <Line 
                    key={category}
                    type="monotone" 
                    dataKey={category} 
                    stroke={colors[index]} 
                    strokeWidth={3}
                    name={category.charAt(0).toUpperCase() + category.slice(1)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Comparison Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Analisis Perbandingan Mingguan
          </CardTitle>
          <CardDescription>
            Perbandingan harga rata-rata minggu ini vs minggu lalu dengan analisis tren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyComparison.map((item) => (
              <div key={item.category} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold capitalize text-lg">{item.category}</h4>
                  <Badge 
                    variant={item.trend === 'up' ? 'destructive' : item.trend === 'down' ? 'default' : 'secondary'}
                    className="flex items-center space-x-1"
                  >
                    {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                    {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                    <span>{item.changePercent}%</span>
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minggu Ini:</span>
                    <span className="font-medium">Rp {item.thisWeek.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minggu Lalu:</span>
                    <span className="font-medium">Rp {item.lastWeek.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Perubahan:</span>
                    <span className={`font-medium ${item.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.change >= 0 ? '+' : ''}Rp {item.change.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {item.trend === 'up' && Math.abs(item.changePercent) > 5 
                    ? "⚠️ Kenaikan signifikan, perlu monitoring"
                    : item.trend === 'down' && Math.abs(item.changePercent) > 5
                    ? "📉 Penurunan signifikan, stok mungkin berlebih"
                    : "✅ Pergerakan normal dalam batas wajar"
                  }
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalytics;