import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email) {
          console.log("No active session found");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        console.log("Checking admin status for:", session.user.email);
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", session.user.email)
          .maybeSingle();

        if (adminError) {
          console.error("Error checking admin status:", adminError);
          setError("Erreur lors de la vérification des droits administrateur");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!adminUser);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Une erreur inattendue s'est produite");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setLoading(false);
        setError(null);
        return;
      }

      if (session?.user?.email) {
        await checkAuth();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading, error };
};