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
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("AdminLogin: Session check result:", { session, error: sessionError });
        
        if (sessionError) {
          console.error("AdminLogin: Session error:", sessionError);
          return;
        }

        if (session) {
          console.log("AdminLogin: Found session, checking admin status for:", session.user.email);
          const { data: adminUser, error: adminError } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          console.log("AdminLogin: Admin check result:", { adminUser, adminError });

          if (adminUser) {
            console.log("AdminLogin: Valid admin user, redirecting to dashboard");
            navigate("/dashboard");
          } else {
            console.log("AdminLogin: Not an admin user, signing out");
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("AdminLogin: Unexpected error during session check:", error);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AdminLogin: Starting login process...");
    setLoading(true);

    try {
      // 1. Vérifier d'abord si l'email est dans la table admin_users
      console.log("AdminLogin: Checking if email is in admin_users:", email);
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      console.log("AdminLogin: Admin check result:", { adminCheck, adminCheckError });

      if (!adminCheck) {
        console.log("AdminLogin: Email not found in admin_users");
        toast({
          title: "Erreur",
          description: "Vous n'êtes pas autorisé à accéder à cette page.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 2. Si l'email est valide, tenter la connexion
      console.log("AdminLogin: Email is valid, attempting login...");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("AdminLogin: Sign in result:", { data, error: signInError });

      if (signInError) {
        throw signInError;
      }

      // 3. Si la connexion réussit
      console.log("AdminLogin: Login successful, waiting for session update");
      toast({
        title: "Succès",
        description: "Connexion réussie",
      });

      // 4. Attendre un peu que la session soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 5. Vérifier que la session est bien mise à jour
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AdminLogin: Final session check:", session);

      if (session) {
        console.log("AdminLogin: Session confirmed, redirecting to dashboard");
        navigate("/dashboard");
      } else {
        console.log("AdminLogin: No session found after login, something went wrong");
        throw new Error("No session found after login");
      }

    } catch (error) {
      console.error("AdminLogin: Login error:", error);
      toast({
        title: "Erreur",
        description: "Email ou mot de passe incorrect",
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