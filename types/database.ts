export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          created_at: string;
          xp: number;
          streak: number;
          selected_course: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          created_at?: string;
          xp?: number;
          streak?: number;
          selected_course?: string | null;
        };
        Update: {
          username?: string | null;
          xp?: number;
          streak?: number;
          selected_course?: string | null;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          name: string;
          category: string;
          exam_format: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          exam_format: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          category?: string;
          exam_format?: string;
        };
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          course_id: string;
          unit_name: string;
          unit_number: number;
        };
        Insert: {
          id: string;
          course_id: string;
          unit_name: string;
          unit_number: number;
        };
        Update: {
          course_id?: string;
          unit_name?: string;
          unit_number?: number;
        };
        Relationships: [];
      };
      concepts: {
        Row: {
          id: string;
          unit_id: string;
          concept_name: string;
          difficulty: string;
          exam_frequency: number;
          importance_weight: number;
        };
        Insert: {
          id: string;
          unit_id: string;
          concept_name: string;
          difficulty: string;
          exam_frequency?: number;
          importance_weight?: number;
        };
        Update: {
          unit_id?: string;
          concept_name?: string;
          difficulty?: string;
          exam_frequency?: number;
          importance_weight?: number;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          concept_id: string;
          question_type: string;
          difficulty: string;
          source_type: string;
          prompt: string;
          stimulus: string | null;
          choices: Json;
          correct_answer: string;
          explanation: string;
        };
        Insert: {
          id: string;
          concept_id: string;
          question_type: string;
          difficulty: string;
          source_type: string;
          prompt: string;
          stimulus?: string | null;
          choices?: Json;
          correct_answer: string;
          explanation: string;
        };
        Update: {
          concept_id?: string;
          question_type?: string;
          difficulty?: string;
          source_type?: string;
          prompt?: string;
          stimulus?: string | null;
          choices?: Json;
          correct_answer?: string;
          explanation?: string;
        };
        Relationships: [];
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          correct: boolean;
          response_time: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          correct: boolean;
          response_time?: number;
          created_at?: string;
        };
        Update: {
          correct?: boolean;
          response_time?: number;
        };
        Relationships: [];
      };
      mastery: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          mastery_score: number;
          last_reviewed: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          mastery_score?: number;
          last_reviewed?: string;
        };
        Update: {
          mastery_score?: number;
          last_reviewed?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
