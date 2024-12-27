import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async (email: string) => {
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .single();

        if (adminError) {
          console.error("Admin check error:", adminError);
          setIsAuthenticated(false);
          setError("Erreur lors de la vérification des droits administrateur");
          return;
        }

        setIsAuthenticated(!!adminUser);
        setError(null);
      } catch (error) {
        console.error("Unexpected error:", error);
        setIsAuthenticated(false);
        setError("Une erreur inattendue s'est produite");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setLoading(false);
        setError(null);
        return;
      }

      if (session?.user?.email) {
        await checkAdminStatus(session.user.email);
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    // Initial check
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await checkAdminStatus(session.user.email);
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading, error };
};