export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agen_lpg: {
        Row: {
          alamat: string
          created_at: string
          id: string
          kecamatan: string
          kelurahan: string
          latitude: number | null
          longitude: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          id?: string
          kecamatan: string
          kelurahan: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          id?: string
          kecamatan?: string
          kelurahan?: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha?: string
          nomor_spbu?: string
          penanggungjawab?: string
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      agen_realisasi_bbm: {
        Row: {
          alamat: string
          created_at: string
          id: string
          jenis_bbm_id: string | null
          kecamatan: string
          kelurahan: string
          latitude: number | null
          longitude: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          periode_bulan: number
          periode_tahun: number
          realisasi_bulanan: number | null
          target_bulanan: number | null
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          id?: string
          jenis_bbm_id?: string | null
          kecamatan: string
          kelurahan: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          periode_bulan: number
          periode_tahun: number
          realisasi_bulanan?: number | null
          target_bulanan?: number | null
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          id?: string
          jenis_bbm_id?: string | null
          kecamatan?: string
          kelurahan?: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha?: string
          nomor_spbu?: string
          penanggungjawab?: string
          periode_bulan?: number
          periode_tahun?: number
          realisasi_bulanan?: number | null
          target_bulanan?: number | null
          telepon?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agen_realisasi_bbm_jenis_bbm_id_fkey"
            columns: ["jenis_bbm_id"]
            isOneToOne: false
            referencedRelation: "jenis_bbm"
            referencedColumns: ["id"]
          },
        ]
      }
      agen_realisasi_gas_3kg: {
        Row: {
          alamat: string
          created_at: string
          id: string
          kecamatan: string
          kelurahan: string
          latitude: number | null
          longitude: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          periode_bulan: number
          periode_tahun: number
          realisasi_bulanan: number | null
          target_bulanan: number | null
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          id?: string
          kecamatan: string
          kelurahan: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          periode_bulan: number
          periode_tahun: number
          realisasi_bulanan?: number | null
          target_bulanan?: number | null
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          id?: string
          kecamatan?: string
          kelurahan?: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha?: string
          nomor_spbu?: string
          penanggungjawab?: string
          periode_bulan?: number
          periode_tahun?: number
          realisasi_bulanan?: number | null
          target_bulanan?: number | null
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      jenis_bbm: {
        Row: {
          created_at: string
          id: string
          keterangan: string | null
          nama_jenis: string
          satuan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          keterangan?: string | null
          nama_jenis: string
          satuan?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          keterangan?: string | null
          nama_jenis?: string
          satuan?: string
          updated_at?: string
        }
        Relationships: []
      }
      markets: {
        Row: {
          address: string
          city: string
          contact: string | null
          created_at: string
          id: number
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          city?: string
          contact?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          contact?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      pangkalan_lpg: {
        Row: {
          alamat: string
          created_at: string
          id: string
          kecamatan: string
          kelurahan: string
          latitude: number | null
          longitude: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          id?: string
          kecamatan: string
          kelurahan: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          id?: string
          kecamatan?: string
          kelurahan?: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha?: string
          nomor_spbu?: string
          penanggungjawab?: string
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      price_surveys: {
        Row: {
          commodity_id: number
          created_at: string
          id: string
          market_id: number
          notes: string | null
          operator_name: string
          price: number
          quality: string
          stock_status: string
          survey_date: string
          updated_at: string
        }
        Insert: {
          commodity_id: number
          created_at?: string
          id?: string
          market_id: number
          notes?: string | null
          operator_name: string
          price: number
          quality: string
          stock_status: string
          survey_date: string
          updated_at?: string
        }
        Update: {
          commodity_id?: number
          created_at?: string
          id?: string
          market_id?: number
          notes?: string | null
          operator_name?: string
          price?: number
          quality?: string
          stock_status?: string
          survey_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      spbe: {
        Row: {
          alamat: string
          created_at: string
          id: string
          kecamatan: string
          kelurahan: string
          latitude: number | null
          longitude: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          id?: string
          kecamatan: string
          kelurahan: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          id?: string
          kecamatan?: string
          kelurahan?: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha?: string
          nomor_spbu?: string
          penanggungjawab?: string
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      spbu_lpg: {
        Row: {
          alamat: string
          created_at: string
          id: string
          kecamatan: string
          kelurahan: string
          latitude: number | null
          longitude: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat: string
          created_at?: string
          id?: string
          kecamatan: string
          kelurahan: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha: string
          nomor_spbu: string
          penanggungjawab: string
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string
          created_at?: string
          id?: string
          kecamatan?: string
          kelurahan?: string
          latitude?: number | null
          longitude?: number | null
          nama_usaha?: string
          nomor_spbu?: string
          penanggungjawab?: string
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stock_bapokting: {
        Row: {
          april: number | null
          august: number | null
          commodity_id: number
          created_at: string
          december: number | null
          february: number | null
          id: string
          january_capaian: number | null
          july: number | null
          june: number | null
          march: number | null
          may: number | null
          november: number | null
          october: number | null
          operator_name: string
          september: number | null
          store_name: string
          survey_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          april?: number | null
          august?: number | null
          commodity_id: number
          created_at?: string
          december?: number | null
          february?: number | null
          id?: string
          january_capaian?: number | null
          july?: number | null
          june?: number | null
          march?: number | null
          may?: number | null
          november?: number | null
          october?: number | null
          operator_name: string
          september?: number | null
          store_name: string
          survey_date: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          april?: number | null
          august?: number | null
          commodity_id?: number
          created_at?: string
          december?: number | null
          february?: number | null
          id?: string
          january_capaian?: number | null
          july?: number | null
          june?: number | null
          march?: number | null
          may?: number | null
          november?: number | null
          october?: number | null
          operator_name?: string
          september?: number | null
          store_name?: string
          survey_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operator", "user"],
    },
  },
} as const
