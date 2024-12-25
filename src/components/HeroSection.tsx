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
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          SX TOUR
          <span className="text-primary ml-2">DOUAI</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 animate-slide-up font-light max-w-3xl mx-auto">
          Le plus grand événement de Supercross du Nord de la France
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-scale-in">
          <a
            href="/tickets"
            className="btn btn-primary px-8 py-4 text-lg"
          >
            Réserver maintenant
          </a>
          <a
            href="/contact"
            className="btn bg-white/10 text-white hover:bg-white/20 px-8 py-4 text-lg backdrop-blur-sm"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;