import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export const useAdminAuth = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.email) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

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

    checkAdminStatus();
  }, [session, supabase]);

  return { isAuthenticated, loading, error };
};