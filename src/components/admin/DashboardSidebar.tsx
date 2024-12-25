import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, LogOut, MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/admin/login");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: Users,
      label: "Pilotes",
      path: "/admin/pilots",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/admin/messages",
    },
  ];

  return (
    <Sidebar className="fixed inset-y-0 left-0 z-50 w-20 bg-gray-900">
      <SidebarContent>
        <div className="py-4 text-center text-white text-sm font-medium">
          Menu
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    className="flex h-16 w-16 flex-col items-center justify-center gap-1 text-white/80 hover:text-white hover:bg-gray-800"
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-8 w-8" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center text-white/80 hover:text-white hover:bg-gray-800 p-4 rounded-lg transition-colors"
        >
          <LogOut className="h-8 w-8" />
        </button>
      </div>
    </Sidebar>
  );
}