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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      birthday_recipients: {
        Row: {
          background_music_url: string | null
          birthday_date: string
          cake_page_subtitle: string
          cake_page_title: string
          countdown_subtitle: string
          countdown_title: string
          created_at: string
          created_by: string | null
          final_reveal_message: string
          id: string
          instagram_link: string | null
          letter_paragraphs: Json
          letter_signature: string
          letter_title: string
          memories: Json
          password_hash: string
          profile_image_url: string | null
          quiz_questions: Json
          recipient_name: string
          sender_name: string
          show_final_reveal: boolean
          show_memory_timeline: boolean
          show_quiz: boolean
          show_voice_message: boolean
          show_wish_vault: boolean
          slug: string
          star_page_message: string
          timezone: string
          updated_at: string
          voice_message_url: string | null
        }
        Insert: {
          background_music_url?: string | null
          birthday_date?: string
          cake_page_subtitle?: string
          cake_page_title?: string
          countdown_subtitle?: string
          countdown_title?: string
          created_at?: string
          created_by?: string | null
          final_reveal_message?: string
          id?: string
          instagram_link?: string | null
          letter_paragraphs?: Json
          letter_signature?: string
          letter_title?: string
          memories?: Json
          password_hash: string
          profile_image_url?: string | null
          quiz_questions?: Json
          recipient_name?: string
          sender_name?: string
          show_final_reveal?: boolean
          show_memory_timeline?: boolean
          show_quiz?: boolean
          show_voice_message?: boolean
          show_wish_vault?: boolean
          slug: string
          star_page_message?: string
          timezone?: string
          updated_at?: string
          voice_message_url?: string | null
        }
        Update: {
          background_music_url?: string | null
          birthday_date?: string
          cake_page_subtitle?: string
          cake_page_title?: string
          countdown_subtitle?: string
          countdown_title?: string
          created_at?: string
          created_by?: string | null
          final_reveal_message?: string
          id?: string
          instagram_link?: string | null
          letter_paragraphs?: Json
          letter_signature?: string
          letter_title?: string
          memories?: Json
          password_hash?: string
          profile_image_url?: string | null
          quiz_questions?: Json
          recipient_name?: string
          sender_name?: string
          show_final_reveal?: boolean
          show_memory_timeline?: boolean
          show_quiz?: boolean
          show_voice_message?: boolean
          show_wish_vault?: boolean
          slug?: string
          star_page_message?: string
          timezone?: string
          updated_at?: string
          voice_message_url?: string | null
        }
        Relationships: []
      }
      site_config: {
        Row: {
          background_music_url: string | null
          birthday_date: string
          cake_page_subtitle: string
          cake_page_title: string
          config_key: string
          countdown_subtitle: string
          countdown_title: string
          created_at: string
          final_reveal_message: string
          id: string
          instagram_link: string | null
          letter_paragraphs: Json
          letter_signature: string
          letter_title: string
          memories: Json
          profile_image_url: string | null
          quiz_questions: Json
          recipient_name: string
          sender_name: string
          show_final_reveal: boolean
          show_memory_timeline: boolean
          show_quiz: boolean
          show_voice_message: boolean
          show_wish_vault: boolean
          star_page_message: string
          timezone: string
          updated_at: string
          voice_message_url: string | null
        }
        Insert: {
          background_music_url?: string | null
          birthday_date?: string
          cake_page_subtitle?: string
          cake_page_title?: string
          config_key?: string
          countdown_subtitle?: string
          countdown_title?: string
          created_at?: string
          final_reveal_message?: string
          id?: string
          instagram_link?: string | null
          letter_paragraphs?: Json
          letter_signature?: string
          letter_title?: string
          memories?: Json
          profile_image_url?: string | null
          quiz_questions?: Json
          recipient_name?: string
          sender_name?: string
          show_final_reveal?: boolean
          show_memory_timeline?: boolean
          show_quiz?: boolean
          show_voice_message?: boolean
          show_wish_vault?: boolean
          star_page_message?: string
          timezone?: string
          updated_at?: string
          voice_message_url?: string | null
        }
        Update: {
          background_music_url?: string | null
          birthday_date?: string
          cake_page_subtitle?: string
          cake_page_title?: string
          config_key?: string
          countdown_subtitle?: string
          countdown_title?: string
          created_at?: string
          final_reveal_message?: string
          id?: string
          instagram_link?: string | null
          letter_paragraphs?: Json
          letter_signature?: string
          letter_title?: string
          memories?: Json
          profile_image_url?: string | null
          quiz_questions?: Json
          recipient_name?: string
          sender_name?: string
          show_final_reveal?: boolean
          show_memory_timeline?: boolean
          show_quiz?: boolean
          show_voice_message?: boolean
          show_wish_vault?: boolean
          star_page_message?: string
          timezone?: string
          updated_at?: string
          voice_message_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
