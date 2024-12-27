import { Home, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DashboardSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Accueil" },
    { path: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  ];

  return (
    <nav className="h-full w-full">
      <div className="flex md:flex-col items-center justify-around md:justify-start md:space-y-4 h-full py-4 bg-accent">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-20 h-20 text-xs text-center transition-colors ${
              isActive(item.path)
                ? "text-primary-foreground"
                : "text-gray-400 hover:text-primary-foreground"
            }`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}