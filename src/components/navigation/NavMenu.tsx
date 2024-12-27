import { Home, Ticket, MessageSquare, LayoutDashboard, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { useState, useEffect } from "react";
import { MobileMenuOverlay } from "./MobileMenuOverlay";
import { MenuItem } from "./types";

interface NavMenuProps {
  isActive: (path: string) => boolean;
  isAdmin: boolean;
  onLogout?: () => void;
}

export const NavMenu = ({ isActive, isAdmin, onLogout }: NavMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/contact", label: "Contact", icon: MessageSquare },
    ...(isAdmin ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  const handleItemClick = () => {
    setIsMenuOpen(false);
  };

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
    <div className="flex items-center">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-md"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </button>

        <MobileMenuOverlay
          isOpen={isMenuOpen}
          menuItems={menuItems}
          isActive={isActive}
          isAdmin={isAdmin}
          onItemClick={handleItemClick}
          onLogout={onLogout}
        />
      </div>

      {/* Desktop menu */}
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