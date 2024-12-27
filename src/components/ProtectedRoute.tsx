import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, error } = useAdminAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur d'authentification",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  console.log("ProtectedRoute: Current state:", { 
    isAuthenticated, 
    loading, 
    error,
    path: location.pathname 
  });

  // Afficher le loader uniquement lors du chargement initial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/dashboard/login" replace state={{ from: location }} />;
  }

  // Rendre le contenu protégé si authentifié
  return <>{children}</>;
};

export default ProtectedRoute;