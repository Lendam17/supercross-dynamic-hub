import { Home, Ticket, MessageSquare, LayoutDashboard, Users } from "lucide-react";
import { NavLink } from "./NavLink";
import { useState } from "react";

interface NavMenuProps {
  isActive: (path: string) => boolean;
  isAdmin: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const NavMenu = ({ isActive, isAdmin, isMobile = false, onItemClick }: NavMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/contact", label: "Contact", icon: MessageSquare },
    ...(isAdmin ? [{ path: "/admin", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  const handleItemClick = () => {
    setIsMenuOpen(false);
    onItemClick?.();
  };

  return (
    <div className="flex flex-col items-center w-full md:w-auto">
      {isMobile ? (
        <div className="w-full md:hidden">
          {/* Menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center p-2 mb-4 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-6 w-6 text-gray-900" />
          </button>
          
          {/* Menu mobile déroulant */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col items-center gap-4 mb-4`}>
            {menuItems.map(({ path, label }) => (
              <NavLink key={path} to={path} isActive={isActive(path)} onClick={handleItemClick}>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex gap-8 items-center">
          {menuItems.map(({ path, label }) => (
            <NavLink key={path} to={path} isActive={isActive(path)} onClick={handleItemClick}>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};