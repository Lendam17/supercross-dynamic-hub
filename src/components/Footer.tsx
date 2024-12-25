import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="text-center sm:text-left animate-fade-in">
            <h3 className="text-gray-900 font-bold text-xl mb-4 font-['Oswald']">
              SX TOUR DOUAI
            </h3>
            <p className="text-gray-600">
              L'événement Supercross incontournable du Nord de la France
            </p>
          </div>
          <div className="text-center sm:text-left animate-fade-in [animation-delay:100ms]">
            <h3 className="text-gray-900 font-bold text-xl mb-4 font-['Oswald']">
              Contact
            </h3>
            <p className="text-gray-600">Email: contact@sxtour-douai.fr</p>
            <p className="text-gray-600">Tél: +33 3 XX XX XX XX</p>
          </div>
          <div className="text-center sm:text-left animate-fade-in [animation-delay:200ms]">
            <h3 className="text-gray-900 font-bold text-xl mb-4 font-['Oswald']">
              Suivez-nous
            </h3>
            <div className="flex justify-center sm:justify-start space-x-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2024 SX Tour Douai. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;