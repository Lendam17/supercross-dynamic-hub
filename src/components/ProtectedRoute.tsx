import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, error } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur d'authentification",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("ProtectedRoute: Auth state", { isAuthenticated, loading, error });

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/dashboard/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;