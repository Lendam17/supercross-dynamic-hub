import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          setIsAuthenticated(!!adminUser);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("ProtectedRoute: Auth state changed:", { event, session });
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (session) {
        try {
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          setIsAuthenticated(!!adminUser);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;