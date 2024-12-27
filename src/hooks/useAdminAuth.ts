import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (email: string | undefined) => {
      if (!email) {
        console.log("useAdminAuth: No email provided");
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        console.log("useAdminAuth: Checking admin status for:", email);
        const { data: adminUser, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .single();

        if (error) throw error;

        if (mounted) {
          setIsAuthenticated(!!adminUser);
          console.log("useAdminAuth: Admin status set to:", !!adminUser);
        }
      } catch (error) {
        console.error("useAdminAuth: Error checking admin status:", error);
        if (mounted) setIsAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const setupAuthListener = () => {
      return supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("useAdminAuth: Auth state changed:", event);

        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          console.log("useAdminAuth: User signed out or no session");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        await checkAdminStatus(session.user.email);
      });
    };

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          await checkAdminStatus(session.user.email);
        } else {
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("useAdminAuth: Error in initialization:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = setupAuthListener();
    initialize();

    return () => {
      console.log("useAdminAuth: Cleaning up");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
};