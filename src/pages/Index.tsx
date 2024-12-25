import HeroSection from "@/components/HeroSection";
import PilotesSection from "@/components/PilotesSection";
import TeaserSection from "@/components/TeaserSection";
import ProgrammeSection from "@/components/ProgrammeSection";
import PartenairesSection from "@/components/PartenairesSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TeaserSection />
      <ProgrammeSection />
      <PilotesSection />
      <PartenairesSection />
    </div>
  );
};

export default Index;