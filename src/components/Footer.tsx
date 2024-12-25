const Footer = () => {
  return (
    <footer className="bg-accent py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">SX TOUR DOUAI</h3>
            <p className="text-gray-400">
              L'événement Supercross incontournable du Nord de la France
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-400">Email: contact@sxtour-douai.fr</p>
            <p className="text-gray-400">Tél: +33 3 XX XX XX XX</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary">
                Facebook
              </a>
              <a href="#" className="text-white hover:text-primary">
                Instagram
              </a>
              <a href="#" className="text-white hover:text-primary">
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © 2024 SX Tour Douai. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;