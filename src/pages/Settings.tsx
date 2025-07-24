import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save } from "lucide-react";
import UserRoleManagement from "@/components/UserRoleManagement";

const settingsSchema = z.object({
  applicationName: z.string().min(1, "Nama aplikasi harus diisi"),
  applicationLogo: z.any().optional(),
  contact: z.string().min(1, "Kontak harus diisi"),
  departmentName: z.string().min(1, "Nama dinas harus diisi"),
  departmentAddress: z.string().min(1, "Alamat dinas harus diisi"),
  departmentWebsite: z.string().url("Website harus berupa URL yang valid").optional().or(z.literal("")),
  departmentEmail: z.string().email("Email harus valid"),
  departmentLogo: z.any().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [applicationLogoPreview, setApplicationLogoPreview] = React.useState<string>("");
  const [departmentLogoPreview, setDepartmentLogoPreview] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      applicationName: "",
      contact: "",
      departmentName: "",
      departmentAddress: "",
      departmentWebsite: "",
      departmentEmail: "",
    },
  });

  const applicationLogoFile = watch("applicationLogo");
  const departmentLogoFile = watch("departmentLogo");

  React.useEffect(() => {
    if (applicationLogoFile && applicationLogoFile[0]) {
      const file = applicationLogoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setApplicationLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [applicationLogoFile]);

  React.useEffect(() => {
    if (departmentLogoFile && departmentLogoFile[0]) {
      const file = departmentLogoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setDepartmentLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [departmentLogoFile]);

  const onSubmit = (data: SettingsFormData) => {
    console.log("Settings saved:", data);
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan sistem berhasil disimpan.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
          <p className="text-muted-foreground">
            Kelola pengaturan aplikasi dan informasi dinas
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pengaturan Aplikasi */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Aplikasi</CardTitle>
              <CardDescription>
                Konfigurasi dasar aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="applicationName">Nama Aplikasi</Label>
                <Input
                  id="applicationName"
                  {...register("applicationName")}
                  placeholder="Masukkan nama aplikasi"
                />
                {errors.applicationName && (
                  <p className="text-sm text-destructive">
                    {errors.applicationName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationLogo">Logo Aplikasi</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="applicationLogo"
                    type="file"
                    accept="image/*"
                    {...register("applicationLogo")}
                    className="flex-1"
                  />
                  {applicationLogoPreview && (
                    <div className="w-16 h-16 border border-border rounded-md overflow-hidden">
                      <img
                        src={applicationLogoPreview}
                        alt="Preview logo aplikasi"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Kontak</Label>
                <Input
                  id="contact"
                  {...register("contact")}
                  placeholder="Masukkan informasi kontak"
                />
                {errors.contact && (
                  <p className="text-sm text-destructive">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Manajemen Role Pengguna */}
          <UserRoleManagement />

          <Separator />

          {/* Informasi Dinas */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dinas</CardTitle>
              <CardDescription>
                Konfigurasi informasi dinas/instansi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departmentName">Nama Dinas</Label>
                <Input
                  id="departmentName"
                  {...register("departmentName")}
                  placeholder="Masukkan nama dinas"
                />
                {errors.departmentName && (
                  <p className="text-sm text-destructive">
                    {errors.departmentName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentAddress">Alamat Dinas</Label>
                <Input
                  id="departmentAddress"
                  {...register("departmentAddress")}
                  placeholder="Masukkan alamat lengkap dinas"
                />
                {errors.departmentAddress && (
                  <p className="text-sm text-destructive">
                    {errors.departmentAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentWebsite">Website Dinas</Label>
                <Input
                  id="departmentWebsite"
                  {...register("departmentWebsite")}
                  placeholder="https://example.com"
                  type="url"
                />
                {errors.departmentWebsite && (
                  <p className="text-sm text-destructive">
                    {errors.departmentWebsite.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentEmail">Email Dinas</Label>
                <Input
                  id="departmentEmail"
                  {...register("departmentEmail")}
                  placeholder="admin@example.com"
                  type="email"
                />
                {errors.departmentEmail && (
                  <p className="text-sm text-destructive">
                    {errors.departmentEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentLogo">Logo Dinas</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="departmentLogo"
                    type="file"
                    accept="image/*"
                    {...register("departmentLogo")}
                    className="flex-1"
                  />
                  {departmentLogoPreview && (
                    <div className="w-16 h-16 border border-border rounded-md overflow-hidden">
                      <img
                        src={departmentLogoPreview}
                        alt="Preview logo dinas"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="submit" className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;