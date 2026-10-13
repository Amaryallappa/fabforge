import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawAnonKey &&
  rawUrl.startsWith('http') &&
  !rawUrl.includes('your-project')
);

// Fallback to valid URL so createClient does not throw in production without .env
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://demo-project.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawAnonKey : 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      fabforge_quotes: {
        Row: {
          id: string;
          user_id: string | null;
          file_name: string;
          file_url: string | null;
          material: string;
          thickness_mm: number | null;
          quantity: number;
          process: string;
          secondary_ops: string[];
          price_inr: number;
          status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered';
          lead_time_days: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fabforge_quotes']['Row'], 'id' | 'created_at'>;
      };
      fabforge_orders: {
        Row: {
          id: string;
          quote_id: string;
          user_id: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          payment_status: string;
          shipping_address: Record<string, string> | null;
          gstin: string | null;
          invoice_url: string | null;
          created_at: string;
        };
      };
      fabforge_profiles: {
        Row: {
          id: string;
          phone: string | null;
          full_name: string | null;
          company: string | null;
          gstin: string | null;
          state_code: string | null;
          whatsapp_opted: boolean;
        };
      };
    };
  };
};
