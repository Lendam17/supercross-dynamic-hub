import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("AdminLogin: Checking initial auth state...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          console.log("AdminLogin: Session found, checking admin status");
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .maybeSingle();

          if (adminUser) {
            console.log("AdminLogin: Admin user found, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("AdminLogin: Auth check error:", error);
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);
    console.log("AdminLogin: Starting login process...");

    try {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (!adminUser) {
        throw new Error("Accès non autorisé");
      }

      console.log("AdminLogin: Admin user found, attempting sign in");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log("AdminLogin: Sign in successful");
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
        toast({
          title: "Succès",
          description: "Connexion réussie",
        });
      }
    } catch (error: any) {
      console.error("AdminLogin: Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!initialCheckDone) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Administration</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;