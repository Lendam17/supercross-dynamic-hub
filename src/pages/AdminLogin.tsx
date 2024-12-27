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
          console.error("AdminLogin: Session check error:", sessionError);
          return;
        }

        if (session) {
          console.log("AdminLogin: Session exists, checking admin status for email:", session.user.email);
          try {
            const { data: adminUser, error: adminError } = await supabase
              .from("admin_users")
              .select("email")
              .eq("email", session.user.email)
              .single();

            console.log("AdminLogin: Admin check result:", { adminUser, adminError });
            
            if (adminError) {
              console.error("AdminLogin: Admin check error:", adminError);
              await supabase.auth.signOut();
              navigate("/dashboard/login");
              return;
            }

            if (adminUser) {
              console.log("AdminLogin: Valid admin user, redirecting to dashboard");
              navigate("/dashboard", { replace: true });
            } else {
              console.log("AdminLogin: Not an admin user, signing out");
              await supabase.auth.signOut();
              navigate("/dashboard/login");
            }
          } catch (error) {
            console.error("AdminLogin: Error during admin check:", error);
            await supabase.auth.signOut();
            navigate("/dashboard/login");
          }
        } else {
          console.log("AdminLogin: No active session");
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
      console.log("AdminLogin: Checking admin status for:", email);
      const { data: adminCheck, error: adminError } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      console.log("AdminLogin: Admin check result:", { adminCheck, adminError });

      if (adminError) {
        console.error("AdminLogin: Admin check error:", adminError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des droits d'administrateur.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

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

      console.log("AdminLogin: Attempting to sign in with email");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("AdminLogin: Sign in result:", { data, error: signInError });

      if (signInError) {
        console.error("AdminLogin: Sign in error:", signInError);
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