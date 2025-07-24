import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const kepokmasData = [
  { id: 1, name: "Beras Medium", unit: "kg", category: "Bahan Pokok" },
  { id: 2, name: "Beras Premium", unit: "kg", category: "Bahan Pokok" },
  { id: 3, name: "Kedelai Lokal", unit: "kg", category: "Bahan Pokok" },
  { id: 4, name: "Kedelai Impor", unit: "kg", category: "Bahan Pokok" },
  { id: 5, name: "Cabai Merah Keriting", unit: "kg", category: "Sayuran" },
  { id: 6, name: "Cabai Merah Besar", unit: "kg", category: "Sayuran" },
  { id: 7, name: "Cabai Rawit Merah", unit: "kg", category: "Sayuran" },
  { id: 8, name: "Cabai Rawit Hijau", unit: "kg", category: "Sayuran" },
  { id: 9, name: "Bawang Merah", unit: "kg", category: "Sayuran" },
  { id: 10, name: "Bawang Putih Honan", unit: "kg", category: "Sayuran" },
  { id: 11, name: "Bawang Putih Kating", unit: "kg", category: "Sayuran" },
  { id: 12, name: "Bawang Bombay", unit: "kg", category: "Sayuran" },
  { id: 13, name: "Gula Pasir Curah", unit: "kg", category: "Bahan Pokok" },
  { id: 14, name: "Gula Pasir Kemasan", unit: "kg", category: "Bahan Pokok" },
  { id: 15, name: "Minyak Goreng Curah", unit: "liter", category: "Bahan Pokok" },
  { id: 16, name: "Minyak Goreng Premium", unit: "liter", category: "Bahan Pokok" },
  { id: 17, name: "Minyak Goreng Minyakita", unit: "liter", category: "Bahan Pokok" },
  { id: 18, name: "Tepung Terigu Protein Tinggi", unit: "kg", category: "Bahan Pokok" },
  { id: 19, name: "Tepung Terigu Protein Sedang", unit: "kg", category: "Bahan Pokok" },
  { id: 20, name: "Tepung Terigu Protein Rendah", unit: "kg", category: "Bahan Pokok" },
  { id: 21, name: "Daging Ayam Ras", unit: "kg", category: "Protein Hewani" },
  { id: 22, name: "Daging Ayam Kampung", unit: "kg", category: "Protein Hewani" },
  { id: 23, name: "Daging Sapi Bagian Paha Belakang", unit: "kg", category: "Protein Hewani" },
  { id: 24, name: "Daging Sapi Bagian Paha Depan", unit: "kg", category: "Protein Hewani" },
  { id: 25, name: "Daging Sapi Bagian Sandung Lamur", unit: "kg", category: "Protein Hewani" },
  { id: 26, name: "Daging Sapi Bagian Tetelan", unit: "kg", category: "Protein Hewani" },
  { id: 27, name: "Telur Ayam Ras", unit: "kg", category: "Protein Hewani" },
  { id: 28, name: "Telur Ayam Kampung", unit: "kg", category: "Protein Hewani" },
  { id: 29, name: "Ikan Bandeng", unit: "kg", category: "Protein Hewani" },
  { id: 30, name: "Ikan Kembung", unit: "kg", category: "Protein Hewani" },
  { id: 31, name: "Ikan Tongkol/Tuna/Cangkalang", unit: "kg", category: "Protein Hewani" },
  { id: 32, name: "Ikan Teri Asin", unit: "kg", category: "Protein Hewani" },
  { id: 33, name: "Udang Segar", unit: "kg", category: "Protein Hewani" },
  { id: 34, name: "Tempe Kedelai", unit: "kg", category: "Protein Nabati" },
  { id: 35, name: "Tahu Mentah Putih", unit: "kg", category: "Protein Nabati" },
  { id: 36, name: "Tomat", unit: "kg", category: "Sayuran" },
  { id: 37, name: "Ketimun", unit: "kg", category: "Sayuran" },
  { id: 38, name: "Sawi Hijau", unit: "kg", category: "Sayuran" },
  { id: 39, name: "Kangkung", unit: "kg", category: "Sayuran" },
  { id: 40, name: "Kacang Panjang", unit: "kg", category: "Sayuran" },
  { id: 41, name: "Kentang", unit: "kg", category: "Sayuran" },
  { id: 42, name: "Pisang Lokal", unit: "kg", category: "Buah" },
  { id: 43, name: "Jeruk Lokal", unit: "kg", category: "Buah" },
  { id: 44, name: "Jagung pipilan", unit: "kg", category: "Bahan Pokok" },
  { id: 45, name: "Mie Intan Kari", unit: "bungkus", category: "Makanan Olahan" },
  { id: 46, name: "Garam Halus", unit: "kg", category: "Bahan Pokok" },
  { id: 47, name: "Susu Kental Manis Kaleng (Frisian Flag 370g)", unit: "kaleng", category: "Minuman" },
  { id: 48, name: "Susu Bubuk (Dancow 390gr)", unit: "pak", category: "Minuman" },
  { id: 49, name: "Ketela Pohon", unit: "kg", category: "Umbi-umbian" },
  { id: 50, name: "Kacang Hijau", unit: "kg", category: "Protein Nabati" }
];

const categories = ["Semua", "Bahan Pokok", "Protein Hewani", "Protein Nabati", "Sayuran", "Buah", "Umbi-umbian", "Makanan Olahan", "Minuman"];

const Kepokmas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredData = kepokmasData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: string) => {
    if (category === "Semua") return kepokmasData.length;
    return kepokmasData.filter(item => item.category === category).length;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Bahan Pokok": "bg-blue-100 text-blue-800",
      "Protein Hewani": "bg-red-100 text-red-800",
      "Protein Nabati": "bg-green-100 text-green-800",
      "Sayuran": "bg-yellow-100 text-yellow-800",
      "Buah": "bg-purple-100 text-purple-800",
      "Umbi-umbian": "bg-orange-100 text-orange-800",
      "Makanan Olahan": "bg-pink-100 text-pink-800",
      "Minuman": "bg-cyan-100 text-cyan-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kepokmas</h1>
          <p className="text-muted-foreground">
            Kebutuhan Pokok Masyarakat - Daftar komoditas untuk survey harian
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredData.length} dari {kepokmasData.length} komoditas
        </Badge>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Data komoditas ini akan digunakan oleh operator untuk survey harian dan akan diverifikasi oleh verifikator.
        </AlertDescription>
      </Alert>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Komoditas</CardTitle>
          <CardDescription>
            Gunakan filter untuk mencari komoditas tertentu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari komoditas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-auto py-2"
              >
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getCategoryCount(category)}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commodity List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Per {item.unit}
                </Badge>
                <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Tidak ada komoditas ditemukan</h3>
            <p className="text-sm text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Kepokmas;