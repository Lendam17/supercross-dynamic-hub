import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-gray-900 font-['Oswald'] font-bold text-xl tracking-wider">
            SX TOUR
            <span className="text-primary ml-2">DOUAI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "text-primary"
                  : "text-gray-900 hover:text-primary transition-colors duration-300"
              } font-['Oswald'] tracking-wide`}
            >
              Accueil
            </Link>
            <Link
              to="/tickets"
              className={`${
                isActive("/tickets")
                  ? "text-primary"
                  : "text-gray-900 hover:text-primary transition-colors duration-300"
              } font-['Oswald'] tracking-wide`}
            >
              Tickets
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive("/contact")
                  ? "text-primary"
                  : "text-gray-900 hover:text-primary transition-colors duration-300"
              } font-['Oswald'] tracking-wide`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900 p-2 hover:text-primary transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md ${
                  isActive("/")
                    ? "text-primary"
                    : "text-gray-900 hover:text-primary transition-colors duration-300"
                } font-['Oswald'] tracking-wide`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/tickets"
                className={`block px-3 py-2 rounded-md ${
                  isActive("/tickets")
                    ? "text-primary"
                    : "text-gray-900 hover:text-primary transition-colors duration-300"
                } font-['Oswald'] tracking-wide`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tickets
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-md ${
                  isActive("/contact")
                    ? "text-primary"
                    : "text-gray-900 hover:text-primary transition-colors duration-300"
                } font-['Oswald'] tracking-wide`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;