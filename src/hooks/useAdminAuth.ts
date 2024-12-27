import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (email: string | undefined) => {
      if (!email) {
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: adminUser, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (error) {
          console.error("Error checking admin status:", error);
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(!!adminUser);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAdminAuth: Auth state changed:", { event, session });
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await checkAdminStatus(session.user.email);
    });

    // Initial check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        await checkAdminStatus(session?.user.email);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
};