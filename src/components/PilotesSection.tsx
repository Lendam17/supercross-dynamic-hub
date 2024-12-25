import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PilotesSection = () => {
  const { data: pilots, isLoading } = useQuery({
    queryKey: ['pilots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pilots')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            LES <span className="text-primary">PILOTES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6 bg-gray-50">
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          LES <span className="text-primary">PILOTES</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pilots?.map((pilot) => (
            <Card
              key={pilot.id}
              className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in group border border-gray-200"
            >
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={pilot.image_url || '/placeholder.svg'}
                    alt={`${pilot.first_name} ${pilot.last_name}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pilot.first_name}{" "}
                    <span className="text-primary">{pilot.last_name}</span>
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