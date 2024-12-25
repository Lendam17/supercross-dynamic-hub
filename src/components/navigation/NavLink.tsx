import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavLink = ({ to, isActive, children, onClick }: NavLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${
        isActive
          ? "text-primary"
          : "text-gray-900 hover:text-primary transition-colors duration-300"
      } font-['Oswald'] tracking-wide flex items-center gap-2 justify-center`}
    >
      {children}
    </Link>
  );
};