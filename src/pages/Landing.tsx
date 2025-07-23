import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Store, Users, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlider from "@/components/HeroSlider";
import InteractiveMap from "@/components/InteractiveMap";
import TrendAnalytics from "@/components/TrendAnalytics";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header with Login Button */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">SIMDAG</h1>
                <p className="text-sm text-muted-foreground">Sistem Informasi Perdagangan</p>
              </div>
            </div>
            
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/login">
                Masuk Sistem
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Perdagangan Kota Salatiga
            </h1>
            <h2 className="text-3xl font-semibold text-foreground">
              Sistem Informasi Perdagangan Terintegrasi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitoring dan analisis komprehensif untuk mendukung kebijakan perdagangan 
              yang efektif di Kota Salatiga
            </p>
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
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Fitur Unggulan SIMDAG
            </h3>
            <p className="text-lg text-muted-foreground">
              Solusi digital untuk monitoring perdagangan Kota Salatiga
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Monitoring Pasar</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Pemantauan harga dan ketersediaan komoditas di seluruh pasar tradisional
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Analisis Tren</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Analisis pergerakan harga dan tren perdagangan untuk pengambilan keputusan
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Data Pedagang</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Database lengkap pedagang, toko besar, SPBU, dan distributor LPG
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Laporan Real-time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Laporan dan dashboard real-time untuk monitoring kondisi perdagangan
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Cakupan Wilayah Salatiga
            </h3>
            <p className="text-lg text-muted-foreground">
              Monitoring perdagangan di 4 kecamatan Kota Salatiga
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { area: "Sidorejo", markets: "3 Pasar", traders: "150+ Pedagang" },
              { area: "Sidomulyo", markets: "2 Pasar", traders: "120+ Pedagang" },
              { area: "Tingkir", markets: "4 Pasar", traders: "200+ Pedagang" },
              { area: "Argomulyo", markets: "2 Pasar", traders: "100+ Pedagang" }
            ].map((area, index) => (
              <Card key={index} className="text-center border-2">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{area.area}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold text-foreground">{area.markets}</p>
                  <p className="text-muted-foreground">{area.traders}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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