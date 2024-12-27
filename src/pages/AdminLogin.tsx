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
        console.log("AdminLogin: Session data:", session);
        
        if (sessionError) {
          console.error("AdminLogin: Session error:", sessionError);
          return;
        }

        if (session) {
          console.log("AdminLogin: Found session, user email:", session.user.email);
          const { data: adminUser, error: adminError } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", session.user.email)
            .single();

          console.log("AdminLogin: Admin check result:", { adminUser, adminError });

          if (adminUser) {
            console.log("AdminLogin: Valid admin user, redirecting");
            navigate("/dashboard");
          } else {
            console.log("AdminLogin: Not an admin user, signing out");
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("AdminLogin: Unexpected error:", error);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AdminLogin: Starting login process...");
    setLoading(true);

    try {
      console.log("AdminLogin: Checking admin status for email:", email);
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      console.log("AdminLogin: Admin check result:", { adminCheck, adminCheckError });

      if (!adminCheck) {
        console.log("AdminLogin: Not an admin user");
        toast({
          title: "Erreur",
          description: "Vous n'êtes pas autorisé à accéder à cette page.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("AdminLogin: Starting Supabase auth...");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("AdminLogin: Auth result:", { data, error: signInError });

      if (signInError) {
        throw signInError;
      }

      console.log("AdminLogin: Login successful");
      toast({
        title: "Succès",
        description: "Connexion réussie",
      });
      
      // Petit délai pour laisser le temps à Supabase de mettre à jour la session
      setTimeout(() => {
        console.log("AdminLogin: Redirecting to dashboard");
        navigate("/dashboard");
      }, 500);

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