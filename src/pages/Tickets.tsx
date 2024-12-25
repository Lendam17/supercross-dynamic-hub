import TicketCard from "@/components/TicketCard";

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
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Billetterie
        </h1>
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