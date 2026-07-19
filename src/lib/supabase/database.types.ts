export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string;
          display_name: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          display_name?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          category: string;
          category_name: string;
          description: string;
          full_description: string;
          image_url: string;
          gallery: string[];
          price_note: string;
          features: string[];
          specs: Json;
          is_available: boolean;
          is_visible: boolean;
          is_bestseller: boolean;
          is_clearance: boolean;
          clearance_note: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          category: string;
          category_name: string;
          description: string;
          full_description: string;
          image_url: string;
          gallery?: string[];
          price_note: string;
          features?: string[];
          specs?: Json;
          is_available?: boolean;
          is_visible?: boolean;
          is_bestseller?: boolean;
          is_clearance?: boolean;
          clearance_note?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          reference_code: string;
          client_request_id: string;
          categories: string[];
          industry: string;
          quantity: string;
          timeline: string;
          contact_name: string;
          organization: string;
          email: string;
          phone: string;
          location: string;
          details: string | null;
          status: string;
          email_status: string;
          email_error: string | null;
          source_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_code: string;
          client_request_id: string;
          categories: string[];
          industry: string;
          quantity: string;
          timeline: string;
          contact_name: string;
          organization: string;
          email: string;
          phone: string;
          location: string;
          details?: string | null;
          status?: string;
          email_status?: string;
          email_error?: string | null;
          source_path?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          email_status?: string;
          email_error?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notify_requests: {
        Row: {
          id: string;
          reference_code: string;
          client_request_id: string;
          product_id: string | null;
          product_title: string;
          email: string;
          phone: string | null;
          status: string;
          email_status: string;
          email_error: string | null;
          source_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_code: string;
          client_request_id: string;
          product_id?: string | null;
          product_title: string;
          email: string;
          phone?: string | null;
          status?: string;
          email_status?: string;
          email_error?: string | null;
          source_path?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          email_status?: string;
          email_error?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      lead_rate_limits: {
        Row: {
          fingerprint: string;
          window_started_at: string;
          request_count: number;
          updated_at: string;
        };
        Insert: {
          fingerprint: string;
          window_started_at?: string;
          request_count?: number;
          updated_at?: string;
        };
        Update: {
          window_started_at?: string;
          request_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      consume_public_rate_limit: {
        Args: {
          p_fingerprint: string;
          p_limit: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
