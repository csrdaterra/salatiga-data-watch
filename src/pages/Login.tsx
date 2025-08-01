import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// User accounts data
const userAccounts = {
  admin: { password: "admin123", role: "admin", name: "Administrator", email: "admin@salatiga.go.id" },
  verifikator: { password: "verifikator123", role: "verifikator", name: "Verifikator", email: "verifikator@salatiga.go.id" },
  operator: { password: "operator123", role: "operator", name: "Operator", email: "operator@salatiga.go.id" }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      const user = userAccounts[username as keyof typeof userAccounts];
      
      if (user && user.password === password) {
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${user.name}`,
        });
        
        // Store auth data
        localStorage.setItem("simdag_auth", "true");
        localStorage.setItem("simdag_role", user.role);
        localStorage.setItem("simdag_user", JSON.stringify({
          username,
          name: user.name,
          email: user.email,
          role: user.role
        }));
        
        // Navigate based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "operator") {
          navigate("/operator");
        } else {
          navigate("/dashboard"); // For verifikator
        }
      } else {
        toast({
          title: "Login Gagal",
          description: "Username atau password tidak valid",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary">SIMDAG</h1>
              <p className="text-sm text-muted-foreground">Sistem Informasi Perdagangan</p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Masuk ke Sistem</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses dashboard admin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Akun Demo:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Verifikator:</strong> verifikator / verifikator123</p>
                <p><strong>Operator:</strong> operator / operator123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link to="/">← Kembali ke Halaman Utama</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;