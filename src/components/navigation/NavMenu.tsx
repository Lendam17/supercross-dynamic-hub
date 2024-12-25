import { Home, Ticket, MessageSquare, LayoutDashboard, Users } from "lucide-react";
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

  // Icônes du menu admin pour mobile
  const adminMenuItems = [
    { path: "/admin", icon: LayoutDashboard },
    { path: "/admin/pilots", icon: Users },
    { path: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col items-center w-full md:w-auto">
      {/* Menu principal */}
      <div className={`flex ${isMobile ? 'gap-6' : 'gap-8'} items-center justify-center`}>
        {menuItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} isActive={isActive(path)} onClick={onItemClick}>
            <Icon className={`h-5 w-5 ${isMobile ? 'block md:hidden' : 'hidden md:block'}`} />
            <span className={isMobile ? 'hidden md:block' : 'block'}>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Menu admin mobile */}
      {isAdmin && isMobile && (
        <div className="flex gap-8 mt-4 p-3 bg-accent rounded-lg md:hidden">
          {adminMenuItems.map(({ path, icon: Icon }) => (
            <NavLink key={path} to={path} isActive={isActive(path)} onClick={onItemClick}>
              <Icon className="h-6 w-6 text-white" />
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};