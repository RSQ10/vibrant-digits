// @ts-ignore - supabase-js may not be installed
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://rbbazflmhkzxtfwabyuy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYmF6ZmxtaGt6eHRmd2FieXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDQ4MDMsImV4cCI6MjA5MDg4MDgwM30.WVtdQqZlWFV-t8YYrp5aO3DFvFFB0VKbwpHc4fkYSqg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Review = {
  id: string;
  product_handle: string;
  product_title: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};
