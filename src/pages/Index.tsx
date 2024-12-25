import HeroSection from "@/components/HeroSection";
import PilotesSection from "@/components/PilotesSection";
import TeaserSection from "@/components/TeaserSection";
import ProgrammeSection from "@/components/ProgrammeSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TeaserSection />
      <ProgrammeSection />
      <PilotesSection />
    </div>
  );
};

export default Index;