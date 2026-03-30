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
      badges: {
        Row: {
          criteria_type: string
          criteria_value: number | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          criteria_type: string
          criteria_value?: number | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          criteria_type?: string
          criteria_value?: number | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      daily_quests: {
        Row: {
          description: string
          fincoin_reward: number
          id: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
        }
        Insert: {
          description: string
          fincoin_reward: number
          id?: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
        }
        Update: {
          description?: string
          fincoin_reward?: number
          id?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number
        }
        Relationships: []
      }
      league_rankings: {
        Row: {
          demoted_to: string | null
          id: string
          league: string
          promoted_to: string | null
          rank: number | null
          user_id: string
          week_start: string
          xp_week: number | null
        }
        Insert: {
          demoted_to?: string | null
          id?: string
          league: string
          promoted_to?: string | null
          rank?: number | null
          user_id: string
          week_start: string
          xp_week?: number | null
        }
        Update: {
          demoted_to?: string | null
          id?: string
          league?: string
          promoted_to?: string | null
          rank?: number | null
          user_id?: string
          week_start?: string
          xp_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_rankings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          activity_data: Json
          id: string
          is_quiz: boolean | null
          lesson_number: number
          section_id: number
          section_title: string
          title: string
          xp_reward: number | null
        }
        Insert: {
          activity_data?: Json
          id?: string
          is_quiz?: boolean | null
          lesson_number: number
          section_id: number
          section_title: string
          title: string
          xp_reward?: number | null
        }
        Update: {
          activity_data?: Json
          id?: string
          is_quiz?: boolean | null
          lesson_number?: number
          section_id?: number
          section_title?: string
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_id: number | null
          created_at: string | null
          daily_goal_minutes: number | null
          fincoins: number | null
          hearts: number | null
          hearts_updated_at: string | null
          id: string
          last_lesson_date: string | null
          league: string | null
          level: string | null
          objective: string | null
          streak_current: number | null
          streak_longest: number | null
          username: string | null
          xp_boost_until: string | null
          xp_total: number | null
          xp_weekly: number | null
        }
        Insert: {
          avatar_id?: number | null
          created_at?: string | null
          daily_goal_minutes?: number | null
          fincoins?: number | null
          hearts?: number | null
          hearts_updated_at?: string | null
          id: string
          last_lesson_date?: string | null
          league?: string | null
          level?: string | null
          objective?: string | null
          streak_current?: number | null
          streak_longest?: number | null
          username?: string | null
          xp_boost_until?: string | null
          xp_total?: number | null
          xp_weekly?: number | null
        }
        Update: {
          avatar_id?: number | null
          created_at?: string | null
          daily_goal_minutes?: number | null
          fincoins?: number | null
          hearts?: number | null
          hearts_updated_at?: string | null
          id?: string
          last_lesson_date?: string | null
          league?: string | null
          level?: string | null
          objective?: string | null
          streak_current?: number | null
          streak_longest?: number | null
          username?: string | null
          xp_boost_until?: string | null
          xp_total?: number | null
          xp_weekly?: number | null
        }
        Relationships: []
      }
      streak_freezes: {
        Row: {
          created_at: string | null
          id: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streak_freezes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string | null
          fincoins_spent: number
          id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fincoins_spent: number
          id?: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          fincoins_spent?: number
          id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_quest_progress: {
        Row: {
          completed: boolean | null
          date: string | null
          id: string
          progress: number | null
          quest_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          date?: string | null
          id?: string
          progress?: number | null
          quest_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          date?: string | null
          id?: string
          progress?: number | null
          quest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "daily_quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_daily_quest_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          attempts: number | null
          completed: boolean | null
          completed_at: string | null
          id: string
          lesson_id: string
          perfect: boolean | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id: string
          perfect?: boolean | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id?: string
          perfect?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_results: {
        Row: {
          id: string
          passed: boolean | null
          score: number | null
          section_id: number
          taken_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          passed?: boolean | null
          score?: number | null
          section_id: number
          taken_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          passed?: boolean | null
          score?: number | null
          section_id?: number
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_effective_hearts: {
        Args: { p_hearts: number; p_hearts_updated_at: string }
        Returns: number
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
