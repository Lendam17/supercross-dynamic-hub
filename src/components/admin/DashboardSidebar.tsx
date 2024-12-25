import { NavLink } from "react-router-dom";
import { Home, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const links = [
    { to: "/admin", icon: Home, label: "Accueil" },
    { to: "/admin/pilots", icon: Users, label: "Pilotes" },
    { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
  ];

  return (
    <div className="h-full md:h-screen md:w-20 w-full bg-accent">
      <nav className="flex md:flex-col justify-around md:justify-start items-center h-16 md:h-full md:pt-8 md:gap-8">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 text-white/80 hover:text-white transition-colors duration-200",
                "md:w-full md:aspect-square",
                isActive ? "text-white" : "text-white/80"
              )
            }
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1 md:text-[10px]">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}