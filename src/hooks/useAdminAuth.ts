import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async (email: string) => {
      try {
        console.log("Checking admin status for:", email);
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (adminError) {
          console.error("Admin check error:", adminError);
          setIsAuthenticated(false);
          setError("Erreur lors de la vérification des droits administrateur");
          return;
        }

        const isAdmin = !!adminUser;
        console.log("Is admin?", isAdmin);
        setIsAuthenticated(isAdmin);
        setError(null);
      } catch (error) {
        console.error("Unexpected error:", error);
        setIsAuthenticated(false);
        setError("Une erreur inattendue s'est produite");
      }
    };

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (!session?.user?.email) {
          console.log("No session or email");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        await checkAdminStatus(session.user.email);
      } catch (error) {
        console.error("Session check error:", error);
        setError("Erreur lors de la vérification de la session");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading, error };
};