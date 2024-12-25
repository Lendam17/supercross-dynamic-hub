import HeroSection from "@/components/HeroSection";
import PilotesSection from "@/components/PilotesSection";
import TeaserSection from "@/components/TeaserSection";
import ProgrammeSection from "@/components/ProgrammeSection";
import PartenairesSection from "@/components/PartenairesSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="bg-gradient-cool">
        <TeaserSection />
      </div>
      <div className="bg-gradient-soft">
        <ProgrammeSection />
      </div>
      <div className="bg-white">
        <PilotesSection />
      </div>
      <div className="bg-gradient-cool">
        <PartenairesSection />
      </div>
    </div>
  );
};

export default Index;