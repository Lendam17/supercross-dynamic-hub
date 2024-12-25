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
import { Home, MessageSquare, Users } from "lucide-react";

export function DashboardSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
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
                      <item.icon className="h-6 w-6" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}