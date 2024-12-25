import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Tickets = () => {
  const tickets = [
    {
      title: "PASS 1 JOUR",
      price: "45€",
      features: [
        "Accès à toutes les courses",
        "Place assise en tribune",
        "Programme officiel",
      ],
    },
    {
      title: "PASS VIP",
      price: "120€",
      features: [
        "Accès à toutes les courses",
        "Place assise premium",
        "Accès paddock",
        "Meet & Greet pilotes",
        "Cocktail dînatoire",
      ],
    },
    {
      title: "PASS FAMILLE",
      price: "160€",
      features: [
        "4 places en tribune",
        "4 programmes officiels",
        "2 places parking",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">
            Billetterie
          </h1>
          <Button
            size="lg"
            className="animate-fade-in bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 text-xl"
            onClick={() => window.open('https://www.ticketmaster.fr', '_blank')}
          >
            Acheter des tickets <ExternalLink className="ml-2 h-6 w-6" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tickets.map((ticket, index) => (
            <TicketCard key={index} {...ticket} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tickets;