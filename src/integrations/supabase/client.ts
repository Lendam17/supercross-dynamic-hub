// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://arfgagbqpsosurwjjaah.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZmdhZ2JxcHNvc3Vyd2pqYWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNDQyMzMsImV4cCI6MjA1MDcyMDIzM30.OUUSZFNPPY8Vld8es306LQsS09Edn1R28p8THi8vFwI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);