import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactCTA } from "@/components/ContactCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedPosts />
        <SkillsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
