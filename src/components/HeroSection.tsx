const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
          poster="/placeholder.svg"
        >
          <source src="/SXTour2024.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
          SX TOUR
          <span className="text-primary ml-2">DOUAI</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 animate-fade-in max-w-2xl mx-auto">
          Le plus grand événement de Supercross du Nord de la France
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
          <a
            href="/tickets"
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-md font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Réserver maintenant
          </a>
          <a
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-md font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;