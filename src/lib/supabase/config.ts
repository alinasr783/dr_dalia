import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ksaxugyvzeudupnakrwk.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_JoTUz42tAK54oULuEQZIEg_r1yFezwN";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYXh1Z3l2emV1ZHVwbmFrcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MTU1NTAsImV4cCI6MjExMDE5MTU1MH0.ulkcnforJjH4IsgWgb9wJxwosgyK_KtAznx6A6TU6HM";

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYXh1Z3l2emV1ZHVwbmFrcndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDYxNTU1MCwiZXhwIjoyMTEwMTkxNTUwfQ.ZBC2-3kBXRdAe9i-CQlv16GYC3cl5gcJciVVejbOMbU";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://drdalia-dental.com";

export const DASHBOARD_ADMIN_USER =
  process.env.DASHBOARD_ADMIN_USER || "drdalia89is";

export const DASHBOARD_ADMIN_PASS =
  process.env.DASHBOARD_ADMIN_PASS || "admin123";

export const DASHBOARD_USERNAME = DASHBOARD_ADMIN_USER;
export const DASHBOARD_PASSWORD = DASHBOARD_ADMIN_PASS;

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return publicClient;
}

export function getAdminSupabase(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminClient;
}
