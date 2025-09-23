import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export interface Database {
  public: {
    Tables: {
      inspections: {
        Row: {
          id: string;
          datacenter: 'DC1' | 'DC2';
          date: string;
          time: string;
          shift: 'morning' | 'afternoon';
          inspector: string;
          general_observations: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          datacenter: 'DC1' | 'DC2';
          date?: string;
          time?: string;
          shift: 'morning' | 'afternoon';
          inspector: string;
          general_observations?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          datacenter?: 'DC1' | 'DC2';
          date?: string;
          time?: string;
          shift?: 'morning' | 'afternoon';
          inspector?: string;
          general_observations?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          inspection_id: string;
          category: 'clima' | 'electrico' | 'seguridad';
          description: string;
          completed: boolean;
          observations: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          inspection_id: string;
          category: 'clima' | 'electrico' | 'seguridad';
          description: string;
          completed?: boolean;
          observations?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          inspection_id?: string;
          category?: 'clima' | 'electrico' | 'seguridad';
          description?: string;
          completed?: boolean;
          observations?: string;
          created_at?: string;
        };
      };
      work_permits: {
        Row: {
          id: string;
          permit_number: string;
          name: string;
          identification: string;
          company: string;
          access_reason: string;
          equipment_tools: string;
          entry_date: string;
          entry_time: string;
          exit_date: string | null;
          exit_time: string | null;
          authorized_person: string;
          observations: string;
          provider_signature: string;
          dc_manager_signature: string;
          collaborator_signature: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          permit_number?: string;
          name: string;
          identification: string;
          company: string;
          access_reason: string;
          equipment_tools?: string;
          entry_date?: string;
          entry_time?: string;
          exit_date?: string | null;
          exit_time?: string | null;
          authorized_person: string;
          observations?: string;
          provider_signature?: string;
          dc_manager_signature?: string;
          collaborator_signature?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          permit_number?: string;
          name?: string;
          identification?: string;
          company?: string;
          access_reason?: string;
          equipment_tools?: string;
          entry_date?: string;
          entry_time?: string;
          exit_date?: string | null;
          exit_time?: string | null;
          authorized_person?: string;
          observations?: string;
          provider_signature?: string;
          dc_manager_signature?: string;
          collaborator_signature?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      checklist_templates: {
        Row: {
          id: string;
          category: 'clima' | 'electrico' | 'seguridad';
          description: string;
          order_index: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: 'clima' | 'electrico' | 'seguridad';
          description: string;
          order_index?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: 'clima' | 'electrico' | 'seguridad';
          description?: string;
          order_index?: number;
          active?: boolean;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'inspector' | 'supervisor' | 'admin';
          department: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'inspector' | 'supervisor' | 'admin';
          department?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: 'inspector' | 'supervisor' | 'admin';
          department?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}