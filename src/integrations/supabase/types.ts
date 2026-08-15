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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          id: string
          note: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["request_status"]
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["request_status"]
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          profile_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          profile_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          id: string
          industry_id: string | null
          is_demo: boolean
          location: string | null
          logo_url: string | null
          name: string
        }
        Insert: {
          id?: string
          industry_id?: string | null
          is_demo?: boolean
          location?: string | null
          logo_url?: string | null
          name: string
        }
        Update: {
          id?: string
          industry_id?: string | null
          is_demo?: boolean
          location?: string | null
          logo_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign: string
          created_at: string
          currency: string
          donor_profile_id: string | null
          id: string
          is_anonymous: boolean
        }
        Insert: {
          amount?: number
          campaign: string
          created_at?: string
          currency?: string
          donor_profile_id?: string | null
          id?: string
          is_anonymous?: boolean
        }
        Update: {
          amount?: number
          campaign?: string
          created_at?: string
          currency?: string
          donor_profile_id?: string | null
          id?: string
          is_anonymous?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_profile_id_fkey"
            columns: ["donor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          degree: string | null
          end_year: number | null
          field: string | null
          id: string
          institution: string
          profile_id: string
          start_year: number | null
        }
        Insert: {
          degree?: string | null
          end_year?: number | null
          field?: string | null
          id?: string
          institution: string
          profile_id: string
          start_year?: number | null
        }
        Update: {
          degree?: string | null
          end_year?: number | null
          field?: string | null
          id?: string
          institution?: string
          profile_id?: string
          start_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employment: {
        Row: {
          company_id: string | null
          company_name: string | null
          end_year: number | null
          id: string
          is_current: boolean
          location: string | null
          profile_id: string
          start_year: number | null
          title: string
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          end_year?: number | null
          id?: string
          is_current?: boolean
          location?: string | null
          profile_id: string
          start_year?: number | null
          title: string
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          end_year?: number | null
          id?: string
          is_current?: boolean
          location?: string | null
          profile_id?: string
          start_year?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "employment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_scores: {
        Row: {
          computed_at: string
          id: string
          last_active_at: string
          profile_id: string
          score: number
          tier: string
        }
        Insert: {
          computed_at?: string
          id?: string
          last_active_at?: string
          profile_id: string
          score?: number
          tier?: string
        }
        Update: {
          computed_at?: string
          id?: string
          last_active_at?: string
          profile_id?: string
          score?: number
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_scores_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          host_profile_id: string | null
          id: string
          location: string | null
          mode: string | null
          starts_at: string
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          host_profile_id?: string | null
          id?: string
          location?: string | null
          mode?: string | null
          starts_at?: string
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          host_profile_id?: string | null
          id?: string
          location?: string | null
          mode?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_host_profile_id_fkey"
            columns: ["host_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          alumni_id: string
          created_at: string
          goal: string | null
          id: string
          match_score: number | null
          preferred_schedule: string | null
          reason: string | null
          status: Database["public"]["Enums"]["request_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          alumni_id: string
          created_at?: string
          goal?: string | null
          id?: string
          match_score?: number | null
          preferred_schedule?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          alumni_id?: string
          created_at?: string
          goal?: string | null
          id?: string
          match_score?: number | null
          preferred_schedule?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorships: {
        Row: {
          alumni_id: string
          completed_at: string | null
          focus: string | null
          id: string
          next_session_at: string | null
          request_id: string | null
          sessions_completed: number
          started_at: string
          status: Database["public"]["Enums"]["request_status"]
          student_id: string
        }
        Insert: {
          alumni_id: string
          completed_at?: string | null
          focus?: string | null
          id?: string
          next_session_at?: string | null
          request_id?: string | null
          sessions_completed?: number
          started_at?: string
          status?: Database["public"]["Enums"]["request_status"]
          student_id: string
        }
        Update: {
          alumni_id?: string
          completed_at?: string | null
          focus?: string | null
          id?: string
          next_session_at?: string | null
          request_id?: string | null
          sessions_completed?: number
          started_at?: string
          status?: Database["public"]["Enums"]["request_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorships_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorships_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mentorship_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string | null
          profile_id: string
          read_at: string | null
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string | null
          profile_id: string
          read_at?: string | null
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string | null
          profile_id?: string
          read_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          apply_deadline: string | null
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string | null
          experience_required: string | null
          id: string
          is_approved: boolean
          kind: Database["public"]["Enums"]["opportunity_kind"]
          location: string | null
          posted_by: string | null
          required_skills: string[]
          stipend_or_salary: string | null
          title: string
        }
        Insert: {
          apply_deadline?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          experience_required?: string | null
          id?: string
          is_approved?: boolean
          kind?: Database["public"]["Enums"]["opportunity_kind"]
          location?: string | null
          posted_by?: string | null
          required_skills?: string[]
          stipend_or_salary?: string | null
          title: string
        }
        Update: {
          apply_deadline?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          experience_required?: string | null
          id?: string
          is_approved?: boolean
          kind?: Database["public"]["Enums"]["opportunity_kind"]
          location?: string | null
          posted_by?: string | null
          required_skills?: string[]
          stipend_or_salary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_contacts: {
        Row: {
          email: string | null
          linkedin_url: string | null
          phone: string | null
          profile_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          email?: string | null
          linkedin_url?: string | null
          phone?: string | null
          profile_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          email?: string | null
          linkedin_url?: string | null
          phone?: string | null
          profile_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          level: string | null
          profile_id: string
          skill_id: string
        }
        Insert: {
          level?: string | null
          profile_id: string
          skill_id: string
        }
        Update: {
          level?: string | null
          profile_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allow_mentorship_requests: boolean
          allow_messages: boolean
          availability: string | null
          available_to_mentor: boolean
          avatar_url: string | null
          bio: string | null
          career_goal: string | null
          company_id: string | null
          company_name: string | null
          created_at: string
          department: string | null
          designation: string | null
          embedding_placeholder: Json | null
          engagement_score: number
          full_name: string
          graduation_year: number | null
          headline: string | null
          id: string
          industry_id: string | null
          is_demo: boolean
          is_verified: boolean
          location: string | null
          looking_for: string[]
          mentorship_focus: string[]
          onboarding_complete: boolean
          profile_completion: number
          role: Database["public"]["Enums"]["app_role"]
          show_email: boolean
          show_phone: boolean
          students_helped: number
          updated_at: string
          user_id: string | null
          verified_at: string | null
          visibility: Database["public"]["Enums"]["visibility_level"]
          years_experience: number | null
        }
        Insert: {
          allow_mentorship_requests?: boolean
          allow_messages?: boolean
          availability?: string | null
          available_to_mentor?: boolean
          avatar_url?: string | null
          bio?: string | null
          career_goal?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          embedding_placeholder?: Json | null
          engagement_score?: number
          full_name?: string
          graduation_year?: number | null
          headline?: string | null
          id?: string
          industry_id?: string | null
          is_demo?: boolean
          is_verified?: boolean
          location?: string | null
          looking_for?: string[]
          mentorship_focus?: string[]
          onboarding_complete?: boolean
          profile_completion?: number
          role?: Database["public"]["Enums"]["app_role"]
          show_email?: boolean
          show_phone?: boolean
          students_helped?: number
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility_level"]
          years_experience?: number | null
        }
        Update: {
          allow_mentorship_requests?: boolean
          allow_messages?: boolean
          availability?: string | null
          available_to_mentor?: boolean
          avatar_url?: string | null
          bio?: string | null
          career_goal?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          embedding_placeholder?: Json | null
          engagement_score?: number
          full_name?: string
          graduation_year?: number | null
          headline?: string | null
          id?: string
          industry_id?: string | null
          is_demo?: boolean
          is_verified?: boolean
          location?: string | null
          looking_for?: string[]
          mentorship_focus?: string[]
          onboarding_complete?: boolean
          profile_completion?: number
          role?: Database["public"]["Enums"]["app_role"]
          show_email?: boolean
          show_phone?: boolean
          students_helped?: number
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility_level"]
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string
          id: string
          method: string
          notes: string | null
          profile_id: string
          status: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          profile_id: string
          status?: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          profile_id?: string
          status?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifications_verified_by_fkey"
            columns: ["verified_by"]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "alumni" | "admin"
      opportunity_kind: "job" | "internship" | "project" | "referral"
      request_status:
        | "pending"
        | "accepted"
        | "declined"
        | "completed"
        | "cancelled"
      visibility_level:
        | "public"
        | "students_only"
        | "alumni_only"
        | "institution_only"
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
      app_role: ["student", "alumni", "admin"],
      opportunity_kind: ["job", "internship", "project", "referral"],
      request_status: [
        "pending",
        "accepted",
        "declined",
        "completed",
        "cancelled",
      ],
      visibility_level: [
        "public",
        "students_only",
        "alumni_only",
        "institution_only",
      ],
    },
  },
} as const
