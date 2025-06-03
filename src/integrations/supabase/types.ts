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
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points_reward: number
          requirement_type: string
          requirement_value: number
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points_reward?: number
          requirement_type: string
          requirement_value: number
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points_reward?: number
          requirement_type?: string
          requirement_value?: number
          type?: string
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          created_at: string
          date: string
          id: string
          questions_answered: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          questions_answered?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          questions_answered?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          alternativas: string[]
          ano: number
          assunto: string
          banca: string
          comando: string
          comentario: string
          created_at: string | null
          disciplina: string
          enunciado: string
          id: string
          orgao: string
          prova: string
          resposta_correta: string
          updated_at: string | null
        }
        Insert: {
          alternativas: string[]
          ano: number
          assunto: string
          banca: string
          comando: string
          comentario: string
          created_at?: string | null
          disciplina: string
          enunciado: string
          id: string
          orgao: string
          prova: string
          resposta_correta: string
          updated_at?: string | null
        }
        Update: {
          alternativas?: string[]
          ano?: number
          assunto?: string
          banca?: string
          comando?: string
          comentario?: string
          created_at?: string | null
          disciplina?: string
          enunciado?: string
          id?: string
          orgao?: string
          prova?: string
          resposta_correta?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string
          user_answer: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          user_answer: string
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          user_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_performance_stats: {
        Row: {
          accuracy_percentage: number | null
          assunto: string
          correct_answers: number | null
          created_at: string | null
          disciplina: string
          id: string
          incorrect_answers: number | null
          last_answered_at: string | null
          total_questions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          assunto: string
          correct_answers?: number | null
          created_at?: string | null
          disciplina: string
          id?: string
          incorrect_answers?: number | null
          last_answered_at?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          assunto?: string
          correct_answers?: number | null
          created_at?: string | null
          disciplina?: string
          id?: string
          incorrect_answers?: number | null
          last_answered_at?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          best_streak: number
          correct_answers: number
          created_at: string
          id: string
          last_activity_date: string | null
          streak_days: number
          total_answers: number
          total_points: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          best_streak?: number
          correct_answers?: number
          created_at?: string
          id?: string
          last_activity_date?: string | null
          streak_days?: number
          total_answers?: number
          total_points?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          best_streak?: number
          correct_answers?: number
          created_at?: string
          id?: string
          last_activity_date?: string | null
          streak_days?: number
          total_answers?: number
          total_points?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
