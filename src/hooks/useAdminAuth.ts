import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("useAdminAuth: Checking auth status...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email) {
          console.log("useAdminAuth: No active session found");
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
            setError(null);
          }
          return;
        }

        console.log("useAdminAuth: Session found, checking admin status for:", session.user.email);
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", session.user.email)
          .maybeSingle();

        if (adminError) {
          console.error("useAdminAuth: Error checking admin status:", adminError);
          if (mounted) {
            setError("Erreur lors de la vérification des droits administrateur");
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(!!adminUser);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("useAdminAuth: Unexpected error:", err);
        if (mounted) {
          setError("Une erreur inattendue s'est produite");
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    // Initial check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAdminAuth: Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
          setError(null);
        }
        return;
      }

      // Re-check auth status for other events
      await checkAuth();
    });

    return () => {
      console.log("useAdminAuth: Cleanup");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading, error };
};