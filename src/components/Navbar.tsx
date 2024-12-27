import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { NavMenu } from "./navigation/NavMenu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    console.log("Navbar: Starting logout process...");
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Navbar: Signed out successfully");
      setIsAdmin(false);
      navigate("/dashboard/login", { replace: true });
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Navbar: Error logging out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user?.email) {
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          if (mounted) {
            setIsAdmin(!!adminUser);
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Navbar: Auth state changed:", { event, session });
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        console.log("Navbar: User signed out, updating admin status");
        setIsAdmin(false);
        return;
      }

      if (session?.user?.email) {
        try {
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          if (mounted) {
            setIsAdmin(!!adminUser);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          if (mounted) {
            setIsAdmin(false);
          }
        }
      } else {
        if (mounted) {
          setIsAdmin(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-gray-900 font-['Oswald'] font-bold text-xl tracking-wider">
            SX TOUR
            <span className="text-primary ml-2">DOUAI</span>
          </div>

          <div className="flex items-center">
            <NavMenu isActive={isActive} isAdmin={isAdmin} onLogout={handleLogout} />
            {isAdmin && (
              <Button
                variant="default"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hidden md:inline-flex ml-8 bg-primary hover:bg-primary/90 text-white font-['Oswald'] tracking-wide"
              >
                {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;