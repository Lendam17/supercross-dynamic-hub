import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PartenairesSection = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">
            Nos <span className="text-primary">Partenaires</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 flex items-center justify-center h-40">
                  <div className="w-full h-full bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">
          Nos <span className="text-primary">Partenaires</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {partners?.map((partner, index) => (
            <a
              key={partner.id}
              href={partner.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group transform transition-all duration-300 hover:scale-105"
            >
              <Card 
                className="border-2 border-primary/20 overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in bg-white/5 hover:bg-white/10"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardContent className="p-6 flex items-center justify-center h-40">
                  <img
                    src={partner.logo_url || '/placeholder.svg'}
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