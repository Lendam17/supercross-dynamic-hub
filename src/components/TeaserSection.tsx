import { Card, CardContent } from "@/components/ui/card";

const TeaserSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          <span className="text-primary">TEASER</span>
        </h2>
        <Card className="max-w-4xl mx-auto overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in border border-gray-200">
          <CardContent className="p-2 sm:p-4">
            <div className="relative pb-[56.25%] overflow-hidden rounded-lg shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="SX Tour 2024 Teaser"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TeaserSection;