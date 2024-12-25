import { Home, Ticket, MessageSquare, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { useState, useEffect } from "react";

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector('[data-menu-container]');
      const button = document.querySelector('[data-menu-button]');
      if (menu && !menu.contains(event.target as Node) && !button?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="w-full md:w-auto">
      {/* Menu mobile */}
      <div className="md:hidden relative">
        <button
          data-menu-button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-md w-full"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </button>
        
        {/* Menu mobile déroulant */}
        <div
          data-menu-container
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } absolute top-full left-0 right-0 flex-col items-center gap-4 p-4 bg-white shadow-lg rounded-lg mt-2 z-50`}
        >
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
              className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors duration-300 font-['Oswald'] tracking-wide w-full justify-center"
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