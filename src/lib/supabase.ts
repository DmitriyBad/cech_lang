import { createClient } from "@supabase/supabase-js";

// Адреса проєкту й публічний (publishable) ключ призначені для браузера. Доступ до даних обмежують політики RLS у базі.
export const SUPABASE_URL = "https://uqcumxrzqrhfhtgvtpdz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_sy2d_dLKXwLZBa-jAzV8lA_9ha3MAVB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // PKCE повертає код у query (?code=…), а не в #hash, який зайнятий HashRouter.
    flowType: "pkce",
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
