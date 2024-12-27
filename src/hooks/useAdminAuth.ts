import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (email: string | undefined) => {
      if (!mounted || !email) {
        console.log("useAdminAuth: Invalid state for admin check");
        return;
      }

      try {
        console.log("useAdminAuth: Checking admin status for:", email);
        const { data: adminUser, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (error) throw error;

        if (mounted) {
          const isAdmin = !!adminUser;
          console.log("useAdminAuth: Admin status result:", isAdmin);
          setIsAuthenticated(isAdmin);
        }
      } catch (error) {
        console.error("useAdminAuth: Error checking admin status:", error);
        if (mounted) setIsAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const handleAuthChange = async (session: any) => {
      if (!mounted) return;

      if (!session) {
        console.log("useAdminAuth: No session, setting not authenticated");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await checkAdminStatus(session.user.email);
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthChange(session);
      } catch (error) {
        console.error("useAdminAuth: Error in initialization:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAdminAuth: Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          console.log("useAdminAuth: User signed out");
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      await handleAuthChange(session);
    });

    initializeAuth();

    return () => {
      console.log("useAdminAuth: Cleaning up");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
};