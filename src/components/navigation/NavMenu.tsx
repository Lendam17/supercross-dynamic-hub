import { Home, Ticket, MessageSquare, LayoutDashboard } from "lucide-react";
import { NavLink } from "./NavLink";

interface NavMenuProps {
  isActive: (path: string) => boolean;
  isAdmin: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const NavMenu = ({ isActive, isAdmin, isMobile = false, onItemClick }: NavMenuProps) => {
  const menuItems = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/contact", label: "Contact", icon: MessageSquare },
    ...(isAdmin ? [{ path: "/admin", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <div className={`flex ${isMobile ? 'gap-4' : 'gap-8'}`}>
      {menuItems.map(({ path, label, icon: Icon }) => (
        <NavLink key={path} to={path} isActive={isActive(path)} onClick={onItemClick}>
          <Icon className={`h-5 w-5 ${isMobile ? 'text-current' : 'hidden md:block'}`} />
          <span className={isMobile ? 'hidden' : 'block'}>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};