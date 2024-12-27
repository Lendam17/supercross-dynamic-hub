import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: any } } | null = null;

    const checkAdminStatus = async (email: string | undefined) => {
      if (!mounted || !email) {
        console.log("useAdminAuth: Skipping admin check - component unmounted or no email");
        return;
      }

      try {
        console.log("useAdminAuth: Checking admin status for:", email);
        const { data: adminUser, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (error) {
          console.error("useAdminAuth: Error checking admin status:", error);
          if (mounted) setIsAuthenticated(false);
          return;
        }

        if (mounted) {
          console.log("useAdminAuth: Setting authenticated state to:", !!adminUser);
          setIsAuthenticated(!!adminUser);
        }
      } catch (error) {
        console.error("useAdminAuth: Error in checkAdminStatus:", error);
        if (mounted) setIsAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const handleAuthChange = async (session: any) => {
      if (!mounted) return;

      console.log("useAdminAuth: Auth state changed, session:", !!session);
      
      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await checkAdminStatus(session.user.email);
    };

    const initialize = async () => {
      try {
        console.log("useAdminAuth: Initializing");
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthChange(session);

        authSubscription = supabase.auth.onAuthStateChange((_event, session) => {
          handleAuthChange(session);
        });

      } catch (error) {
        console.error("useAdminAuth: Error in initialize:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      console.log("useAdminAuth: Cleaning up");
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  return { isAuthenticated, loading };
};