import { Card, CardContent } from "@/components/ui/card";

interface Pilot {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

const pilots: Pilot[] = [
  {
    id: 1,
    firstName: "Thomas",
    lastName: "Ramette",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    firstName: "Cédric",
    lastName: "Soubeyras",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    firstName: "Anthony",
    lastName: "Bourdon",
    imageUrl: "/placeholder.svg",
  },
];

const PilotesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Nos <span className="text-primary">Pilotes</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pilots.map((pilot) => (
            <Card
              key={pilot.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in"
            >
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={pilot.imageUrl}
                    alt={`${pilot.firstName} ${pilot.lastName}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 bg-accent">
                  <h3 className="text-xl font-semibold text-accent-foreground">
                    {pilot.firstName}{" "}
                    <span className="text-primary">{pilot.lastName}</span>
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PilotesSection;