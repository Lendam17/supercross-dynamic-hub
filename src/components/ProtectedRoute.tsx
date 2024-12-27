import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("ProtectedRoute: Starting auth check...");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("ProtectedRoute: Current session:", session);

        if (session) {
          console.log("ProtectedRoute: Session exists, checking admin status");
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          console.log("ProtectedRoute: Admin check result:", adminUser);

          if (adminUser) {
            console.log("ProtectedRoute: Valid admin user, setting authenticated");
            setIsAuthenticated(true);
          } else {
            console.log("ProtectedRoute: Not an admin user, redirecting to login");
            setIsAuthenticated(false);
            navigate("/dashboard/login", { replace: true });
          }
        } else {
          console.log("ProtectedRoute: No session, redirecting to login");
          setIsAuthenticated(false);
          navigate("/dashboard/login", { replace: true });
        }
      } catch (error) {
        console.error("ProtectedRoute: Auth check error:", error);
        setIsAuthenticated(false);
        navigate("/dashboard/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("ProtectedRoute: Auth state changed:", { event, session });

      if (event === 'SIGNED_OUT') {
        console.log("ProtectedRoute: User signed out, redirecting to login");
        setIsAuthenticated(false);
        navigate("/dashboard/login", { replace: true });
        return;
      }

      if (session) {
        try {
          console.log("ProtectedRoute: New session, checking admin status");
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          console.log("ProtectedRoute: Admin check result:", adminUser);

          if (adminUser) {
            console.log("ProtectedRoute: Valid admin user, setting authenticated");
            setIsAuthenticated(true);
          } else {
            console.log("ProtectedRoute: Not an admin user, redirecting to login");
            setIsAuthenticated(false);
            navigate("/dashboard/login", { replace: true });
          }
        } catch (error) {
          console.error("ProtectedRoute: Error checking admin status:", error);
          setIsAuthenticated(false);
          navigate("/dashboard/login", { replace: true });
        }
      } else {
        console.log("ProtectedRoute: No session in state change, redirecting to login");
        setIsAuthenticated(false);
        navigate("/dashboard/login", { replace: true });
      }
      setLoading(false);
    });

    return () => {
      console.log("ProtectedRoute: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    console.log("ProtectedRoute: Still loading...");
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/dashboard/login" replace />;
  }

  console.log("ProtectedRoute: Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;