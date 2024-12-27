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
      console.log("AdminLogin: Checking initial session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AdminLogin: Initial session:", session);

      if (session) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", session.user.email)
          .single();

        if (adminUser) {
          console.log("AdminLogin: User already authenticated and is admin, redirecting...");
          navigate("/dashboard");
        } else {
          console.log("AdminLogin: User authenticated but not admin, signing out...");
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
      // 1. Vérifier si l'email est dans admin_users
      const { data: adminCheck } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      if (!adminCheck) {
        console.log("AdminLogin: Email not in admin_users");
        toast({
          title: "Erreur",
          description: "Vous n'êtes pas autorisé à accéder à cette page.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 2. Tentative de connexion
      console.log("AdminLogin: Attempting login with Supabase auth...");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("AdminLogin: Sign in error:", signInError);
        throw signInError;
      }

      console.log("AdminLogin: Login successful");
      
      // 3. Vérification finale de la session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("AdminLogin: Session confirmed, redirecting...");
        toast({
          title: "Succès",
          description: "Connexion réussie",
        });
        navigate("/dashboard");
      } else {
        throw new Error("No session after login");
      }
    } catch (error) {
      console.error("AdminLogin: Error during login:", error);
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