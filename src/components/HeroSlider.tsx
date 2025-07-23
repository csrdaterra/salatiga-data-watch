import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, Store, Fuel, BarChart3 } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Monitoring Perdagangan Real-time",
    subtitle: "Pantau harga dan ketersediaan komoditas secara langsung",
    description: "Sistem monitoring terintegrasi untuk memantau pergerakan harga bahan pokok di seluruh pasar tradisional Kota Salatiga.",
    icon: TrendingUp,
    gradient: "from-blue-600 to-blue-800",
    image: "bg-gradient-to-br from-blue-100 to-blue-200"
  },
  {
    id: 2,
    title: "Distribusi BBM & LPG",
    subtitle: "Pemetaan lengkap SPBU dan agen LPG",
    description: "Akses informasi lengkap lokasi, kontak, dan jenis bahan bakar yang tersedia di setiap SPBU dan agen LPG bersubsidi.",
    icon: Fuel,
    gradient: "from-green-600 to-green-800",
    image: "bg-gradient-to-br from-green-100 to-green-200"
  },
  {
    id: 3,
    title: "Analisis Pasar Komprehensif",
    subtitle: "Data dan tren perdagangan terintegrasi",
    description: "Dashboard analitik yang memberikan insight mendalam tentang kondisi perdagangan dan tren ekonomi lokal.",
    icon: BarChart3,
    gradient: "from-purple-600 to-purple-800",
    image: "bg-gradient-to-br from-purple-100 to-purple-200"
  },
  {
    id: 4,
    title: "Jaringan Pasar Tradisional",
    subtitle: "11 pasar tersebar di 4 kecamatan",
    description: "Mencakup seluruh pasar tradisional di Sidorejo, Sidomulyo, Tingkir, dan Argomulyo dengan data pedagang terkini.",
    icon: Store,
    gradient: "from-orange-600 to-orange-800",
    image: "bg-gradient-to-br from-orange-100 to-orange-200"
  }
];

const HeroSlider: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  React.useEffect(() => {
    if (emblaApi) {
      // Auto-play functionality
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);

      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <Card className="border-2 h-96">
                <CardContent className="p-0 h-full">
                  <div className={`h-full bg-gradient-to-br ${slide.gradient} relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className={`w-full h-full ${slide.image}`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center">
                      <div className="container mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div className="space-y-6 text-white">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                  <slide.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h2 className="text-3xl lg:text-4xl font-bold">{slide.title}</h2>
                                  <p className="text-xl text-white/90">{slide.subtitle}</p>
                                </div>
                              </div>
                              
                              <p className="text-lg text-white/80 leading-relaxed">
                                {slide.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Decorative Icon */}
                          <div className="hidden lg:flex justify-center">
                            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <slide.icon className="w-24 h-24 text-white/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full"></div>
                    <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 rounded-full"></div>
                    <div className="absolute top-1/2 right-8 w-12 h-12 bg-white/5 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 hover:bg-background"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2 hover:bg-background"
        onClick={scrollNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60 transition-colors"
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;