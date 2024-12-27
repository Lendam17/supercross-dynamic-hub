import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      console.log("AdminLogin: Checking session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AdminLogin: Current session:", session);
      
      if (session) {
        try {
          console.log("AdminLogin: Session exists, checking admin status");
          const { data: adminUser, error: adminError } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          console.log("AdminLogin: Admin check result:", { adminUser, adminError });
          
          if (adminUser) {
            console.log("AdminLogin: Valid admin user, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          } else {
            console.log("AdminLogin: Not an admin user, staying on login page");
            // Si l'utilisateur est connecté mais n'est pas admin, on le déconnecte
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("AdminLogin: Error checking admin status:", error);
          await supabase.auth.signOut();
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AdminLogin: Starting login process...");
    setLoading(true);

    try {
      console.log("AdminLogin: Checking admin status for:", email);
      const { data: adminCheck, error: adminError } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      console.log("AdminLogin: Admin check result:", { adminCheck, adminError });

      if (adminError || !adminCheck) {
        console.log("AdminLogin: Not an admin user or error occurred");
        toast({
          title: "Erreur",
          description: "Vous n'êtes pas autorisé à accéder à cette page.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("AdminLogin: Attempting to sign in");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("AdminLogin: Sign in result:", { data, error: signInError });

      if (signInError) {
        throw signInError;
      }

      console.log("AdminLogin: Login successful, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
      toast({
        title: "Succès",
        description: "Connexion réussie",
      });
    } catch (error) {
      console.error("AdminLogin: Login error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-md">
      <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;