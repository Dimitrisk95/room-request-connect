export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hotels: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          hotel_code: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          hotel_code?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          hotel_code?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          assigned_to: string | null
          assigned_to_name: string | null
          category: string
          created_at: string | null
          description: string
          guest_name: string
          hotel_id: string | null
          id: string
          notes: string[] | null
          priority: string
          resolved_at: string | null
          resolved_by: string | null
          resolved_by_name: string | null
          room_number: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          assigned_to_name?: string | null
          category: string
          created_at?: string | null
          description: string
          guest_name: string
          hotel_id?: string | null
          id?: string
          notes?: string[] | null
          priority: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_name?: string | null
          room_number: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          assigned_to_name?: string | null
          category?: string
          created_at?: string | null
          description?: string
          guest_name?: string
          hotel_id?: string | null
          id?: string
          notes?: string[] | null
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_name?: string | null
          room_number?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          bed_type: string | null
          capacity: number
          created_at: string | null
          floor: number
          hotel_id: string
          id: string
          room_code: string | null
          room_number: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          bed_type?: string | null
          capacity?: number
          created_at?: string | null
          floor?: number
          hotel_id: string
          id?: string
          room_code?: string | null
          room_number: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          bed_type?: string | null
          capacity?: number
          created_at?: string | null
          floor?: number
          hotel_id?: string
          id?: string
          room_code?: string | null
          room_number?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          modified_by: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          modified_by?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          modified_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_audit_log_modified_by_fkey"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          can_manage_rooms: boolean | null
          can_manage_staff: boolean | null
          created_at: string | null
          email: string
          hotel_id: string | null
          id: string
          name: string
          needs_password_setup: boolean | null
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          room_number: string | null
          updated_at: string | null
        }
        Insert: {
          can_manage_rooms?: boolean | null
          can_manage_staff?: boolean | null
          created_at?: string | null
          email: string
          hotel_id?: string | null
          id?: string
          name: string
          needs_password_setup?: boolean | null
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          room_number?: string | null
          updated_at?: string | null
        }
        Update: {
          can_manage_rooms?: boolean | null
          can_manage_staff?: boolean | null
          created_at?: string | null
          email?: string
          hotel_id?: string | null
          id?: string
          name?: string
          needs_password_setup?: boolean | null
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          room_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_user: {
        Args: {
          user_name: string
          user_email: string
          user_password: string
          user_role?: Database["public"]["Enums"]["user_role"]
          user_hotel_id?: string
        }
        Returns: Json
      }
      create_request: {
        Args: {
          request_id: string
          guest_name: string
          room_number: string
          request_title: string
          request_description: string
          request_category: string
          request_priority: string
          request_status: string
          hotel_id: string
          created_at: string
          updated_at: string
        }
        Returns: Json
      }
      delete_user_and_related_data: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      get_hotel_requests: {
        Args: { hotel_id_param: string }
        Returns: {
          assigned_to: string | null
          assigned_to_name: string | null
          category: string
          created_at: string | null
          description: string
          guest_name: string
          hotel_id: string | null
          id: string
          notes: string[] | null
          priority: string
          resolved_at: string | null
          resolved_by: string | null
          resolved_by_name: string | null
          room_number: string
          status: string
          title: string
          updated_at: string | null
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "staff" | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "staff", "guest"],
    },
  },
} as const
