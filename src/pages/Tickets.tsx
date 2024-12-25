import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Tickets = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-blue via-white to-soft-purple flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-8 animate-fade-in">
          Billetterie
        </h1>
        <p className="text-xl text-gray-600 mb-12 animate-fade-in [animation-delay:200ms]">
          Réservez vos places pour le SX TOUR 2024 et vivez une expérience inoubliable
        </p>
        <Button
          size="lg"
          className="animate-fade-in [animation-delay:400ms] bg-primary hover:bg-primary/90 text-white font-bold py-8 px-12 text-2xl rounded-xl transition-all duration-300 hover:scale-105"
          onClick={() => window.open('https://www.ticketmaster.fr', '_blank')}
        >
          Acheter des tickets <ExternalLink className="ml-2 h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Tickets;