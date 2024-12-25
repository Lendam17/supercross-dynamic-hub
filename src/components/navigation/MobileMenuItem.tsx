import { LucideIcon } from "lucide-react";
import { NavLink } from "./NavLink";

interface MobileMenuItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export const MobileMenuItem = ({ path, label, icon: Icon, isActive, onClick }: MobileMenuItemProps) => {
  return (
    <NavLink to={path} isActive={isActive} onClick={onClick}>
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </NavLink>
  );
};