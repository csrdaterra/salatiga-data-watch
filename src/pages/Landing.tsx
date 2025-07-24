
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Store, Users, MapPin, ArrowRight, AlertTriangle, ShoppingCart, Eye, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroSlider from "@/components/HeroSlider";
import InteractiveMap from "@/components/InteractiveMap";
import TrendAnalytics from "@/components/TrendAnalytics";
import { getMarkets, getMarketsByKecamatan, type Market } from "@/stores/marketStore";

const Landing = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketsByKecamatan, setMarketsByKecamatan] = useState<{ [key: string]: Market[] }>({});

  useEffect(() => {
    const marketData = getMarkets();
    setMarkets(marketData);
    setMarketsByKecamatan(getMarketsByKecamatan());
  }, []);

  // Calculate statistics based on actual market data
  const totalMarkets = markets.length;
  const totalTraders = markets.length * 60; // Estimated 60 traders per market
  const kecamatanData = Object.entries(marketsByKecamatan).map(([kecamatan, kecamatanMarkets]) => ({
    area: `Kec. ${kecamatan}`,
    markets: `${kecamatanMarkets.length} Pasar Tradisional`,
    traders: `${kecamatanMarkets.length * 60}+ Pedagang`,
    highlight: kecamatan === "Sidorejo" ? "primary" : 
              kecamatan === "Sidomulyo" ? "warning" :
              kecamatan === "Tingkir" ? "success" : "accent"
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header with Login Button */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary">SIMDAG</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Sistem Informasi Perdagangan</p>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <Button asChild variant="warning" size="sm" className="text-xs sm:text-sm">
                <Link to="/login">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Login Admin</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
                <Link to="/training">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Training</span>
                  <span className="sm:hidden">Info</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
              SIMDAG Salatiga
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-foreground">
              Sistem Monitoring Bapokmas Pasar
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Platform digital terintegrasi untuk monitoring harga dan ketersediaan komoditas 
              di seluruh pasar tradisional Kota Salatiga oleh Badan Pangan, Kelautan, dan Perikanan (Bapokmas)
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 pt-4">
              <div className="bg-primary/10 text-primary px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                🏛️ {totalMarkets} Pasar Tradisional
              </div>
              <div className="bg-warning/10 text-warning px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                📊 Real-time Monitoring
              </div>
              <div className="bg-success/10 text-success px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                🎯 {Object.keys(marketsByKecamatan).length} Kecamatan
              </div>
            </div>
          </div>
          
          <HeroSlider />
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-6">
          <InteractiveMap />
        </div>
      </section>

      {/* Trend Analytics Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <TrendAnalytics />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Fitur Monitoring Bapokmas
            </h3>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Sistem komprehensif untuk pengawasan harga komoditas dan stabilitas pasar di Salatiga
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <Card className="group border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-primary/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Monitoring Harga Pasar</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Pemantauan harga komoditas pangan dan ketersediaan barang di {totalMarkets} pasar tradisional Salatiga
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-warning/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-warning/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/70 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-warning-foreground" />
                </div>
                <CardTitle className="text-xl">Analisis Fluktuasi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Analisis pergerakan harga dan tren pasar untuk stabilitas pangan Kota Salatiga
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-success/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-success/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success/70 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Store className="w-8 h-8 text-success-foreground" />
                </div>
                <CardTitle className="text-xl">Database Pedagang</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Database lengkap pedagang pasar, toko modern, SPBU, dan agen LPG bersubsidi
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-accent/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Laporan Bapokmas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Laporan berkala untuk mendukung kebijakan pangan dan stabilitas harga di pasar
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section - Market-based Data */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-foreground mb-6">
              Cakupan Monitoring Bapokmas Salatiga
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {totalMarkets > 0 ? (
                `Monitoring komprehensif di ${totalMarkets} pasar tradisional untuk menjaga stabilitas pangan dan harga komoditas`
              ) : (
                `Belum ada pasar yang terdaftar. Silakan tambahkan data pasar melalui panel admin.`
              )}
            </p>
          </div>

          {totalMarkets > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map((market, index) => (
                <Card key={market.id} className="group cursor-pointer text-center border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">{market.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{market.address}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-semibold text-blue-700">50+</p>
                        <p className="text-blue-600">Komoditas</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold text-green-700">Real-time</p>
                        <p className="text-green-600">Update</p>
                      </div>
                    </div>
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium group-hover:bg-primary group-hover:text-white transition-colors">
                      Monitoring Aktif
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        Klik untuk melihat data komoditas real-time
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Belum ada data pasar yang terdaftar</p>
              <p className="text-muted-foreground mb-6">Silakan tambahkan data pasar melalui panel admin</p>
              <Button asChild>
                <Link to="/login">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data Pasar
                </Link>
              </Button>
            </div>
          )}

          {/* Additional Statistics */}
          {totalMarkets > 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">{totalTraders}+</CardTitle>
                  <CardDescription className="text-lg">Total Pedagang Terdaftar</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-warning">50+</CardTitle>
                  <CardDescription className="text-lg">Komoditas Dipantau</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-success">24/7</CardTitle>
                  <CardDescription className="text-lg">Monitoring Real-time</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-primary">SIMDAG</h4>
                <p className="text-sm text-muted-foreground">Pemerintah Kota Salatiga</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              © 2024 Pemerintah Kota Salatiga. Sistem Informasi Perdagangan Terintegrasi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
