import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (email: string | undefined) => {
      console.log("useAdminAuth: Checking admin status for email:", email);
      
      if (!email) {
        console.log("useAdminAuth: No email provided, setting not authenticated");
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        console.log("useAdminAuth: Querying admin_users table");
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

        console.log("useAdminAuth: Admin check result:", { adminUser });
        if (mounted) {
          setIsAuthenticated(!!adminUser);
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

    const initializeAuth = async () => {
      if (!mounted) return;
      
      console.log("useAdminAuth: Initializing auth check");
      setLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("useAdminAuth: Error getting session:", error);
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        console.log("useAdminAuth: Initial session check:", { session });
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
        console.error("useAdminAuth: Error in initializeAuth:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        console.log("useAdminAuth: Component unmounted, skipping update");
        return;
      }

      console.log("useAdminAuth: Auth state changed:", { event, session });
      setLoading(true);

      if (event === 'SIGNED_OUT' || !session) {
        console.log("useAdminAuth: User signed out or no session");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await checkAdminStatus(session.user.email);
    });

    return () => {
      console.log("useAdminAuth: Cleaning up effect");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
};