import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            SX TOUR
            <span className="text-primary ml-2">DOUAI</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "text-primary"
                  : "text-white hover:text-primary transition-colors"
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/tickets"
              className={`${
                isActive("/tickets")
                  ? "text-primary"
                  : "text-white hover:text-primary transition-colors"
              }`}
            >
              Tickets
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive("/contact")
                  ? "text-primary"
                  : "text-white hover:text-primary transition-colors"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;