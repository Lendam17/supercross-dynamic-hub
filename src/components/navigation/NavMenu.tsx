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
      if (isMenuOpen) {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('menu-button');
        if (menu && !menu.contains(event.target as Node) && !button?.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="w-full md:w-auto">
      {/* Menu mobile */}
      <div className="md:hidden">
        <button
          id="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-md"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </button>

        {/* Menu mobile overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu mobile déroulant */}
        <div
          id="mobile-menu"
          className={`fixed left-0 right-0 top-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col items-center gap-6 p-6 pt-20">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} isActive={isActive(path)} onClick={handleItemClick}>
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </NavLink>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  handleItemClick();
                  onLogout?.();
                }}
                className="flex items-center gap-3 text-gray-900 hover:text-primary transition-colors duration-300 font-['Oswald'] tracking-wide w-full justify-center"
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu desktop */}
      <div className="hidden md:flex gap-8 items-center">
        {menuItems.map(({ path, label }) => (
          <NavLink key={path} to={path} isActive={isActive(path)}>
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};