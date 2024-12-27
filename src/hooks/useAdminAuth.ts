import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async (email: string) => {
    try {
      console.log("useAdminAuth: Checking admin status for:", email);
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      if (adminError) {
        console.error("useAdminAuth: Admin check error:", adminError);
        setIsAuthenticated(false);
        setError("Erreur lors de la vérification des droits administrateur");
        return false;
      }

      const isAdmin = !!adminUser;
      console.log("useAdminAuth: Admin status:", isAdmin);
      setIsAuthenticated(isAdmin);
      setError(null);
      return isAdmin;
    } catch (error) {
      console.error("useAdminAuth: Unexpected error:", error);
      setIsAuthenticated(false);
      setError("Une erreur inattendue s'est produite");
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("useAdminAuth: Session error:", sessionError);
          if (mounted) {
            setError("Erreur lors de la récupération de la session");
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (!session?.user?.email) {
          console.log("useAdminAuth: No active session");
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          await checkAdminStatus(session.user.email);
          setLoading(false);
        }
      } catch (error) {
        console.error("useAdminAuth: Init error:", error);
        if (mounted) {
          setError("Erreur d'initialisation de l'authentification");
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAdminAuth: Auth state changed:", event, session?.user?.email);

      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user?.email) {
        setIsAuthenticated(false);
        setLoading(false);
        setError(null);
        return;
      }

      await checkAdminStatus(session.user.email);
      setLoading(false);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading, error };
};