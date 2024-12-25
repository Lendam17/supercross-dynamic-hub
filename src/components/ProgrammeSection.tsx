import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flag, Music } from "lucide-react";

interface Activity {
  time: string;
  title: string;
  icon: JSX.Element;
}

const activities: Activity[] = [
  {
    time: "18h00",
    title: "Ouverture des portes",
    icon: <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
  },
  {
    time: "19h00",
    title: "Début des courses qualificatives",
    icon: <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
  },
  {
    time: "20h30",
    title: "Show freestyle",
    icon: <Music className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
  },
  {
    time: "21h00",
    title: "Finales SX Tour",
    icon: <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
  },
  {
    time: "22h30",
    title: "Remise des prix",
    icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
  },
  {
    time: "23h00",
    title: "After party",
    icon: <Music className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
  },
];

const ProgrammeSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
          Le <span className="text-primary">Programme</span>
        </h2>
        <div className="max-w-3xl mx-auto">
          <Card className="border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors animate-fade-in"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-full">
                      {activity.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-base sm:text-xl font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-primary font-medium text-sm sm:text-base">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProgrammeSection;