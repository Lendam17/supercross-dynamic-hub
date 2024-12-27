import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (email: string | undefined) => {
      if (!mounted || !email) {
        console.log("useAdminAuth: Skipping admin check - component unmounted or no email");
        return;
      }

      setLoading(true); // Reset loading state at the start of check

      try {
        console.log("useAdminAuth: Checking admin status for:", email);
        const { data: adminUser, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (error) {
          console.error("useAdminAuth: Error checking admin status:", error);
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          const isAdmin = !!adminUser;
          console.log("useAdminAuth: Setting authenticated state to:", isAdmin);
          setIsAuthenticated(isAdmin);
          setLoading(false);
        }
      } catch (error) {
        console.error("useAdminAuth: Error in checkAdminStatus:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    const initialize = async () => {
      try {
        console.log("useAdminAuth: Initializing");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("useAdminAuth: No session found");
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        await checkAdminStatus(session.user.email);
      } catch (error) {
        console.error("useAdminAuth: Error in initialize:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAdminAuth: Auth state changed:", { event, session });
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        console.log("useAdminAuth: User signed out, updating admin status");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await checkAdminStatus(session.user.email);
    });

    // Initial check
    initialize();

    // Cleanup
    return () => {
      console.log("useAdminAuth: Cleaning up");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
};