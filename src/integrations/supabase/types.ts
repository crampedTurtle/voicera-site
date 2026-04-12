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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          canonical_url: string
          category: string
          content: string
          created_at: string
          created_by: string | null
          date: string
          deleted_at: string | null
          excerpt: string
          external_url: string | null
          fts: unknown
          id: string
          image: string
          image_alt: string
          image_caption: string
          og_description: string
          og_image: string
          og_title: string
          published: boolean
          read_time: number
          related_posts: string[]
          robots_follow: boolean
          robots_index: boolean
          scheduled_at: string | null
          seo_description: string
          seo_title: string
          slug: string
          source: string | null
          status: string
          tags: string[]
          title: string
          twitter_card: string
          updated_at: string
          visibility: string
        }
        Insert: {
          author?: string
          canonical_url?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          date?: string
          deleted_at?: string | null
          excerpt?: string
          external_url?: string | null
          fts?: unknown
          id?: string
          image?: string
          image_alt?: string
          image_caption?: string
          og_description?: string
          og_image?: string
          og_title?: string
          published?: boolean
          read_time?: number
          related_posts?: string[]
          robots_follow?: boolean
          robots_index?: boolean
          scheduled_at?: string | null
          seo_description?: string
          seo_title?: string
          slug: string
          source?: string | null
          status?: string
          tags?: string[]
          title: string
          twitter_card?: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          author?: string
          canonical_url?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          date?: string
          deleted_at?: string | null
          excerpt?: string
          external_url?: string | null
          fts?: unknown
          id?: string
          image?: string
          image_alt?: string
          image_caption?: string
          og_description?: string
          og_image?: string
          og_title?: string
          published?: boolean
          read_time?: number
          related_posts?: string[]
          robots_follow?: boolean
          robots_index?: boolean
          scheduled_at?: string | null
          seo_description?: string
          seo_title?: string
          slug?: string
          source?: string | null
          status?: string
          tags?: string[]
          title?: string
          twitter_card?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      partner_submissions: {
        Row: {
          business_email: string
          company_name: string
          company_website: string | null
          created_at: string | null
          first_name: string
          id: string
          job_title: string
          last_name: string
          partner_interest: string
        }
        Insert: {
          business_email: string
          company_name: string
          company_website?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          job_title: string
          last_name: string
          partner_interest: string
        }
        Update: {
          business_email?: string
          company_name?: string
          company_website?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          job_title?: string
          last_name?: string
          partner_interest?: string
        }
        Relationships: []
      }
      post_revisions: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string
          id: string
          image: string
          post_id: string
          revision_number: number
          seo_description: string
          seo_title: string
          tags: string[]
          title: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          id?: string
          image?: string
          post_id: string
          revision_number?: number
          seo_description?: string
          seo_title?: string
          tags?: string[]
          title: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          id?: string
          image?: string
          post_id?: string
          revision_number?: number
          seo_description?: string
          seo_title?: string
          tags?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      start_building_submissions: {
        Row: {
          business_email: string
          company_name: string
          company_website: string | null
          created_at: string | null
          first_name: string
          id: string
          job_title: string
          last_name: string
          use_case: string
        }
        Insert: {
          business_email: string
          company_name: string
          company_website?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          job_title: string
          last_name: string
          use_case: string
        }
        Update: {
          business_email?: string
          company_name?: string
          company_website?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          job_title?: string
          last_name?: string
          use_case?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      cleanup_trashed_posts: { Args: never; Returns: number }
      has_editor_or_admin_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_scheduled_posts: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "editor" | "contributor"
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
      app_role: ["admin", "moderator", "user", "editor", "contributor"],
    },
  },
} as const
