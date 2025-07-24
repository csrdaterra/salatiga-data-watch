import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  User, 
  Users, 
  BarChart3, 
  Store, 
  TrendingUp,
  MapPin,
  Eye,
  PlusCircle,
  FileText,
  Settings,
  Monitor,
  Smartphone,
  ArrowRight,
  Target,
  Clock,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Training = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const markCompleted = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const trainingModules = [
    {
      id: "introduction",
      title: "Pengenalan SIMDAG",
      duration: "15 menit",
      level: "Dasar",
      description: "Memahami konsep dan tujuan Sistem Informasi Perdagangan Salatiga",
      topics: [
        "Apa itu SIMDAG?",
        "Tujuan dan manfaat sistem",
        "Peran Bapokmas dalam monitoring pasar",
        "Overview fitur utama"
      ],
      content: {
        overview: "SIMDAG (Sistem Informasi Perdagangan Salatiga) adalah platform digital yang dirancang khusus untuk monitoring harga komoditas dan aktivitas perdagangan di Kota Salatiga.",
        objectives: [
          "Memantau harga komoditas secara real-time",
          "Menganalisis tren pasar dan fluktuasi harga",
          "Mendukung kebijakan pangan Kota Salatiga",
          "Menjaga stabilitas harga dan ketersediaan pangan"
        ]
      }
    },
    {
      id: "user-roles",
      title: "Manajemen Pengguna & Peran",
      duration: "20 menit", 
      level: "Dasar",
      description: "Memahami berbagai peran pengguna dan hak akses dalam sistem",
      topics: [
        "Peran Administrator",
        "Peran Operator Lapangan",
        "Peran Supervisor",
        "Manajemen akses dan keamanan"
      ],
      content: {
        overview: "Sistem SIMDAG memiliki struktur hierarki pengguna yang dirancang untuk mendukung alur kerja monitoring pasar yang efektif.",
        roles: [
          {
            role: "Administrator",
            description: "Memiliki akses penuh untuk konfigurasi sistem, manajemen data master, dan pembuatan laporan",
            permissions: ["Kelola semua data", "Buat laporan", "Manajemen pengguna", "Konfigurasi sistem"]
          },
          {
            role: "Operator",
            description: "Bertugas input data harga dan stok di lapangan",
            permissions: ["Input data harga", "Update ketersediaan", "Lihat data pasar"]
          },
          {
            role: "Supervisor",
            description: "Mengawasi dan memvalidasi data yang diinput operator",
            permissions: ["Validasi data", "Monitor aktivitas", "Lihat laporan"]
          }
        ]
      }
    },
    {
      id: "data-management",
      title: "Manajemen Data Pasar",
      duration: "30 menit",
      level: "Menengah",
      description: "Mengelola data pasar, pedagang, dan komoditas",
      topics: [
        "Registrasi pasar tradisional",
        "Manajemen data pedagang",
        "Database komoditas",
        "Input dan validasi data harga"
      ],
      content: {
        overview: "Modul ini mengajarkan cara mengelola data master sistem, termasuk informasi pasar, pedagang, dan komoditas yang dipantau.",
        processes: [
          "Pendaftaran pasar baru dengan informasi lengkap",
          "Registrasi pedagang dan kios di setiap pasar",
          "Pemeliharaan database komoditas dan harga acuan",
          "Prosedur input dan validasi data harga harian"
        ]
      }
    },
    {
      id: "monitoring",
      title: "Monitoring & Analisis",
      duration: "25 menit",
      level: "Menengah",
      description: "Menggunakan fitur monitoring dan analisis tren harga",
      topics: [
        "Dashboard monitoring real-time",
        "Analisis tren harga",
        "Alert dan notifikasi",
        "Interpretasi data grafik"
      ],
      content: {
        overview: "Pelajari cara menggunakan dashboard untuk monitoring aktivitas pasar dan menganalisis tren harga komoditas.",
        features: [
          "Dashboard real-time dengan indikator status pasar",
          "Grafik tren harga untuk berbagai periode",
          "Sistem alert untuk fluktuasi harga abnormal",
          "Tools analisis perbandingan antar pasar"
        ]
      }
    },
    {
      id: "reporting",
      title: "Pelaporan & Dokumentasi",
      duration: "20 menit",
      level: "Lanjutan",
      description: "Membuat laporan dan dokumentasi untuk stakeholder",
      topics: [
        "Generate laporan harian/mingguan",
        "Laporan analisis pasar",
        "Export data untuk eksternal",
        "Dokumentasi kegiatan monitoring"
      ],
      content: {
        overview: "Modul ini membahas cara membuat berbagai jenis laporan yang dibutuhkan untuk mendukung kebijakan pangan kota.",
        reports: [
          "Laporan Harga Harian - monitoring fluktuasi harga per hari",
          "Laporan Bulanan - analisis tren dan rekomendasi kebijakan",
          "Laporan Khusus - untuk kondisi darurat atau hari besar",
          "Export Data - untuk integrasi dengan sistem lain"
        ]
      }
    },
    {
      id: "mobile-usage",
      title: "Penggunaan Mobile",
      duration: "15 menit",
      level: "Dasar",
      description: "Menggunakan SIMDAG di perangkat mobile (smartphone/tablet)",
      topics: [
        "Akses via mobile browser",
        "Interface mobile-friendly",
        "Input data di lapangan",
        "Sinkronisasi data"
      ],
      content: {
        overview: "SIMDAG dirancang mobile-first untuk memudahkan penggunaan di lapangan menggunakan smartphone atau tablet.",
        mobileFeatures: [
          "Interface responsif yang optimal di semua ukuran layar",
          "Input data cepat dengan form yang disederhanakan",
          "Fitur offline untuk area dengan koneksi terbatas",
          "GPS tracking untuk validasi lokasi input data"
        ]
      }
    }
  ];

  const userPaths = [
    {
      role: "Administrator",
      icon: Settings,
      color: "bg-blue-500",
      description: "Jalur pembelajaran untuk Admin sistem",
      modules: ["introduction", "user-roles", "data-management", "monitoring", "reporting"],
      estimatedTime: "2 jam"
    },
    {
      role: "Operator Lapangan", 
      icon: Smartphone,
      color: "bg-green-500",
      description: "Jalur pembelajaran untuk Operator di lapangan",
      modules: ["introduction", "data-management", "mobile-usage"],
      estimatedTime: "1 jam"
    },
    {
      role: "Supervisor",
      icon: Eye,
      color: "bg-purple-500", 
      description: "Jalur pembelajaran untuk Supervisor",
      modules: ["introduction", "user-roles", "monitoring", "reporting"],
      estimatedTime: "1.5 jam"
    }
  ];

  const getModuleProgress = () => {
    return Math.round((completedModules.length / trainingModules.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">Training SIMDAG</h1>
                <p className="text-sm text-muted-foreground">Panduan Lengkap Sistem Informasi Perdagangan</p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-initial">
                <Link to="/dashboard">
                  <Monitor className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1 sm:flex-initial">
                <Link to="/login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress Section */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Progress Pembelajaran</CardTitle>
                <CardDescription>
                  {completedModules.length} dari {trainingModules.length} modul selesai
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {getModuleProgress()}% Selesai
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getModuleProgress()} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Ringkasan</span>
            </TabsTrigger>
            <TabsTrigger value="paths" className="flex items-center gap-2 py-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Learning Paths</span>
              <span className="sm:hidden">Jalur Belajar</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2 py-2">
              <BookOpen className="w-4 h-4" />
              <span>Modul</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Selamat Datang di Training SIMDAG
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Pelajari cara menggunakan Sistem Informasi Perdagangan Salatiga untuk monitoring 
                harga komoditas dan manajemen data pasar yang efektif.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-2 hover:border-primary/50 transition-all duration-200">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Monitoring Real-time</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Pelajari cara memantau harga komoditas dan aktivitas pasar secara real-time
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-200">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Store className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Manajemen Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Kelola data pasar, pedagang, dan komoditas dengan efisien
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-200">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Pelaporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Buat laporan dan analisis untuk mendukung kebijakan pangan
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Jalur Pembelajaran Berdasarkan Peran
              </h2>
              <p className="text-muted-foreground">
                Pilih jalur pembelajaran yang sesuai dengan peran Anda dalam sistem
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {userPaths.map((path, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 ${path.color} rounded-lg flex items-center justify-center`}>
                        <path.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{path.role}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {path.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Modul yang Diperlukan:</h4>
                      <div className="space-y-2">
                        {path.modules.map((moduleId) => {
                          const module = trainingModules.find(m => m.id === moduleId);
                          return (
                            <div key={moduleId} className="flex items-center justify-between text-sm">
                              <span className="flex items-center">
                                {completedModules.includes(moduleId) ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-muted rounded-full mr-2" />
                                )}
                                {module?.title}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {module?.level}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Modul Pembelajaran
              </h2>
              <p className="text-muted-foreground">
                Klik pada modul untuk melihat detail materi pembelajaran
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {trainingModules.map((module, index) => (
                <Card key={module.id} className="border-2 hover:border-primary/50 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          {completedModules.includes(module.id) ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-muted rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold">{index + 1}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg truncate">{module.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {module.duration}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {module.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleModule(module.id)}
                        className="flex-shrink-0"
                      >
                        {activeModule === module.id ? (
                          <ArrowRight className="w-4 h-4 rotate-90 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 transition-transform" />
                        )}
                      </Button>
                    </div>
                    <CardDescription className="mt-2">{module.description}</CardDescription>
                  </CardHeader>
                  
                  {activeModule === module.id && (
                    <CardContent className="pt-0 border-t">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Overview:</h4>
                          <p className="text-sm text-muted-foreground">{module.content.overview}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Topik Pembelajaran:</h4>
                          <ul className="space-y-1">
                            {module.topics.map((topic, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                          <Button 
                            size="sm" 
                            className="flex-1 sm:flex-initial"
                            onClick={() => markCompleted(module.id)}
                            disabled={completedModules.includes(module.id)}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {completedModules.includes(module.id) ? "Selesai" : "Mulai Belajar"}
                          </Button>
                          {!completedModules.includes(module.id) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 sm:flex-initial"
                              onClick={() => markCompleted(module.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Tandai Selesai
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 sm:py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Training SIMDAG</h4>
                <p className="text-sm text-muted-foreground">Pemerintah Kota Salatiga</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Pemerintah Kota Salatiga. Panduan pelatihan Sistem Informasi Perdagangan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Training;