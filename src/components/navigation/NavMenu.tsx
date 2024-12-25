import { Home, Ticket, MessageSquare, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { NavLink } from "./NavLink";
import { useState } from "react";

interface NavMenuProps {
  isActive: (path: string) => boolean;
  isAdmin: boolean;
  onLogout?: () => void;
}

export const NavMenu = ({ isActive, isAdmin, onLogout }: NavMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/contact", label: "Contact", icon: MessageSquare },
    ...(isAdmin ? [{ path: "/admin", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  const handleItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full md:w-auto">
      {/* Menu mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center p-2 mb-4 hover:bg-gray-100 rounded-md w-full"
        >
          <Menu className="h-6 w-6 text-gray-900" />
        </button>
        
        {/* Menu mobile déroulant */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col items-center gap-4 mb-4`}>
          {menuItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} isActive={isActive(path)} onClick={handleItemClick}>
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                handleItemClick();
                onLogout?.();
              }}
              className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors duration-300 font-['Oswald'] tracking-wide"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          )}
        </div>
      </div>

      {/* Menu desktop */}
      <div className="hidden md:flex gap-8 items-center">
        {menuItems.map(({ path, label }) => (
          <NavLink key={path} to={path} isActive={isActive(path)} onClick={handleItemClick}>
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};