const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        <div className="absolute inset-0 bg-black/80" />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          SX TOUR
          <span className="text-primary"> DOUAI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
          Le plus grand événement de Supercross du Nord de la France
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in">
          <a
            href="/tickets"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Réserver maintenant
          </a>
          <a
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;