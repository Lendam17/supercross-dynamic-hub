import { LogOut } from "lucide-react";
import { MobileMenuItem } from "./MobileMenuItem";
import { MenuItem } from "./types";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  isActive: (path: string) => boolean;
  isAdmin: boolean;
  onItemClick: () => void;
  onLogout?: () => void;
}

export const MobileMenuOverlay = ({
  isOpen,
  menuItems,
  isActive,
  isAdmin,
  onItemClick,
  onLogout,
}: MobileMenuOverlayProps) => {
  return (
    <>
      {/* Overlay background */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onItemClick}
      />

      {/* Menu content */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
          {menuItems.map(({ path, label, icon }) => (
            <MobileMenuItem
              key={path}
              path={path}
              label={label}
              icon={icon}
              isActive={isActive(path)}
              onClick={onItemClick}
            />
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                onItemClick();
                onLogout?.();
              }}
              className="flex items-center gap-3 text-gray-900 hover:text-primary transition-colors duration-300 
                       font-['Oswald'] tracking-wide w-full justify-center text-lg"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </>
  );
};