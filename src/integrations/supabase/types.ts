export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          nom: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          nom: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          nom?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          help_type: string
          id: string
          message: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          help_type: string
          id?: string
          message: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          help_type?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string | null
          email: string
          event_id: string
          id: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id: string
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          nom: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          nom: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          nom?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          current_participants: number | null
          date: string
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          is_free: boolean | null
          keywords: string[] | null
          location: string
          max_participants: number | null
          media_id: string | null
          organizer: string
          price: string | null
          registration_deadline: string | null
          status: string
          tags: string[] | null
          time: string
          title: string
          type: string
          type_event_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          date: string
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          keywords?: string[] | null
          location: string
          max_participants?: number | null
          media_id?: string | null
          organizer?: string
          price?: string | null
          registration_deadline?: string | null
          status?: string
          tags?: string[] | null
          time: string
          title: string
          type?: string
          type_event_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          date?: string
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          keywords?: string[] | null
          location?: string
          max_participants?: number | null
          media_id?: string | null
          organizer?: string
          price?: string | null
          registration_deadline?: string | null
          status?: string
          tags?: string[] | null
          time?: string
          title?: string
          type?: string
          type_event_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_type_event_id_fkey"
            columns: ["type_event_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          mime_type: string | null
          name: string
          publication_id: string | null
          size_bytes: number | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          mime_type?: string | null
          name: string
          publication_id?: string | null
          size_bytes?: number | null
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          mime_type?: string | null
          name?: string
          publication_id?: string | null
          size_bytes?: number | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          author: string
          categorie_id: string | null
          category: string
          content: string
          created_at: string | null
          equipe_id: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          media_url: string | null
          published: boolean | null
          slug: string
          summary: string
          title: string
          type: string
          type_media_principal: string | null
          updated_at: string | null
        }
        Insert: {
          author?: string
          categorie_id?: string | null
          category: string
          content: string
          created_at?: string | null
          equipe_id?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          media_url?: string | null
          published?: boolean | null
          slug: string
          summary: string
          title: string
          type?: string
          type_media_principal?: string | null
          updated_at?: string | null
        }
        Update: {
          author?: string
          categorie_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          equipe_id?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          media_url?: string | null
          published?: boolean | null
          slug?: string
          summary?: string
          title?: string
          type?: string
          type_media_principal?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publications_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      support_info: {
        Row: {
          actif: boolean | null
          created_at: string | null
          details: Json | null
          id: string
          nom: string
          type: string
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          details?: Json | null
          id?: string
          nom: string
          type: string
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          details?: Json | null
          id?: string
          nom?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          nom: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          nom: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          nom?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
