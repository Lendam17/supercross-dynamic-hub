import { Card, CardContent } from "@/components/ui/card";

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const partners: Partner[] = [
  {
    name: "Partenaire 1",
    logo: "/placeholder.svg",
    url: "#",
  },
  {
    name: "Partenaire 2",
    logo: "/placeholder.svg",
    url: "#",
  },
  {
    name: "Partenaire 3",
    logo: "/placeholder.svg",
    url: "#",
  },
  {
    name: "Partenaire 4",
    logo: "/placeholder.svg",
    url: "#",
  },
  {
    name: "Partenaire 5",
    logo: "/placeholder.svg",
    url: "#",
  },
  {
    name: "Partenaire 6",
    logo: "/placeholder.svg",
    url: "#",
  },
];

const PartenairesSection = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">
          Nos <span className="text-primary">Partenaires</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="border-2 border-primary/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}>
                <CardContent className="p-6 flex items-center justify-center h-40">
                  <img
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartenairesSection;