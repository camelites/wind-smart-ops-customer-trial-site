const SUPABASE_JS_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

let supabaseModulePromise = null;

export function isCloudMemoryConfigured(config) {
  return Boolean(config?.supabaseUrl && config?.supabaseAnonKey && config?.tableName);
}

export async function createCloudMemoryClient(config) {
  if (!isCloudMemoryConfigured(config)) return null;
  const { createClient } = await loadSupabaseModule();
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return {
    async getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) return null;
      return data.user || null;
    },
    async sendLoginLink(email) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.href.split("#")[0]
        }
      });
      if (error) throw error;
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    async loadSnapshot(userId) {
      const { data, error } = await supabase
        .from(config.tableName)
        .select("memory,daily_submissions,chapter_assessments,updated_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async saveSnapshot(userId, snapshot) {
      const { error } = await supabase
        .from(config.tableName)
        .upsert({
          user_id: userId,
          memory: snapshot.memory,
          daily_submissions: snapshot.dailySubmissions,
          chapter_assessments: snapshot.chapterAssessments,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onAuthStateChange(callback) {
      return supabase.auth.onAuthStateChange((_event, session) => callback(session?.user || null));
    }
  };
}

function loadSupabaseModule() {
  if (!supabaseModulePromise) supabaseModulePromise = import(SUPABASE_JS_CDN);
  return supabaseModulePromise;
}
